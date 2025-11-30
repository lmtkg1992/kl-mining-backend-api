import {
  // common
  Injectable,
  Inject,
  forwardRef,
  ConflictException,
  NotFoundException,
  HttpCode,
  Logger,
} from "@nestjs/common";
import { CreateAiSnapshotsDto } from "./dto/create-ai-snapshots.dto";
import { UpdateAiSnapshotsDto } from "./dto/update-ai-snapshots.dto";
import { AiSnapshotsRepository } from "./infrastructure/persistence/ai-snapshots.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { AiSnapshots } from "./domain/ai-snapshots";
import { FindAllAiSnapshotsDto } from "./dto/find-all-ai-snapshots.dto";
import { AiCameras } from "src/ai-cameras/domain/ai-cameras";
import { AiCamerasService } from "src/ai-cameras/ai-cameras.service";
import { UnprocessableEntityException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { Types } from "mongoose";
import { AiCamerasRepository } from "src/ai-cameras/infrastructure/persistence/ai-cameras.repository";
import { IngestAiSnapshotDto } from "./dto/ingest-ai-snapshot.dto";
import { ReceiptResponseDto } from "./dto/receipt-response.dto";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "../config/config.type";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { AlertsService } from "../alerts/alerts.service";
import { TrucksService } from "../trucks/trucks.service";
import { TruckStatus } from "../trucks/dto/create-trucks.dto";

@Injectable()
export class AiSnapshotsService {
  private readonly logger = new Logger(AiSnapshotsService.name);
  private readonly s3Client: S3Client | null = null;
  private readonly bucketName: string;
  private readonly useS3: boolean;

  // Special car plates that should be treated as breach_event (normal cars, not trucks)
  private readonly SPECIAL_BREACH_PLATE_NUMBERS = ["93C18563", "93A37278"];

  constructor(
    @Inject(forwardRef(() => AiCamerasService))
    private readonly aiCamerasService: AiCamerasService,
    @Inject(forwardRef(() => AlertsService))
    private readonly alertsService: AlertsService,
    @Inject(forwardRef(() => TrucksService))
    private readonly trucksService: TrucksService,
    // Dependencies here
    private readonly aiSnapshotsRepository: AiSnapshotsRepository,
    private readonly aiCameraRepository: AiCamerasRepository,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    const fileConfig = this.configService.get("file", { infer: true });
    this.useS3 =
      fileConfig?.driver === "s3" || fileConfig?.driver === "s3-presigned";

    if (this.useS3 && fileConfig?.accessKeyId && fileConfig?.secretAccessKey) {
      this.s3Client = new S3Client({
        region: this.configService.get("file.awsS3Region", { infer: true }),
        credentials: {
          accessKeyId: this.configService.getOrThrow("file.accessKeyId", {
            infer: true,
          }),
          secretAccessKey: this.configService.getOrThrow("file.secretAccessKey", {
            infer: true,
          }),
        },
      });
      this.bucketName = this.configService.getOrThrow("file.awsDefaultS3Bucket", {
        infer: true,
      });
    } else {
      this.bucketName = this.configService.get("file.awsDefaultS3Bucket", {
        infer: true,
      }) || "klmining-snapshots";
      this.logger.warn("S3 not configured, will use local storage fallback");
    }
  }

  async create(createAiSnapshotsDto: CreateAiSnapshotsDto) {
    let camera_id: AiCameras | null | undefined = undefined;

    if (createAiSnapshotsDto.camera_id) {
      const camera_idObject = await this.aiCamerasService.findById(
        createAiSnapshotsDto.camera_id,
      );
      if (!camera_idObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            camera_id: "notExists",
          },
        });
      }
      camera_id = camera_idObject;
    } else if (createAiSnapshotsDto.camera_id === null) {
      camera_id = null;
    }
    return this.aiSnapshotsRepository.create({
      camera_id,
      event_id: createAiSnapshotsDto.event_id,
      event_type: createAiSnapshotsDto.event_type,
      image_url: createAiSnapshotsDto.image_url,
      truck_type: createAiSnapshotsDto.truck_type,
      fill_level: createAiSnapshotsDto.fill_level,
      confidence_score: createAiSnapshotsDto.confidence_score,
      plate_number: createAiSnapshotsDto.plate_number,
      camera_code: createAiSnapshotsDto.camera_code,
      timestamp: createAiSnapshotsDto.timestamp,
      direction: createAiSnapshotsDto.direction,
      volume: createAiSnapshotsDto.volume,
      status: createAiSnapshotsDto.status,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.aiSnapshotsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllAiSnapshotsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};
    if (query.camera_id) {
      filter.camera_id = new Types.ObjectId(query.camera_id) as any;
    }
    if (query.site_id) {
      const cameras =
        await this.aiCameraRepository.findAllWithFilterAndPagination({
          filter: { site_id: query.site_id },
          paginationOptions: { page: 1, limit: 10000 },
        });
      const cameraIds = cameras.map((camera) => camera.id);
      filter.camera_id = { $in: cameraIds };
    }

    const [entities, total] = await Promise.all([
      this.aiSnapshotsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.aiSnapshotsRepository.countWithFilter(filter),
    ]);

    return { entities, total };
  }

  findById(id: AiSnapshots["id"]) {
    return this.aiSnapshotsRepository.findById(id);
  }

  findByIds(ids: AiSnapshots["id"][]) {
    return this.aiSnapshotsRepository.findByIds(ids);
  }

  async update(
    id: AiSnapshots["id"],

    updateAiSnapshotsDto: UpdateAiSnapshotsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let camera_id: AiCameras | null | undefined = undefined;

    if (updateAiSnapshotsDto.camera_id) {
      const camera_idObject = await this.aiCamerasService.findById(
        updateAiSnapshotsDto.camera_id,
      );
      if (!camera_idObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            camera_id: "notExists",
          },
        });
      }
      camera_id = camera_idObject;
    } else if (updateAiSnapshotsDto.camera_id === null) {
      camera_id = null;
    }

    return this.aiSnapshotsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      camera_id,
    });
  }

  remove(id: AiSnapshots["id"]) {
    return this.aiSnapshotsRepository.remove(id);
  }

  async ingestSnapshot(ingestDto: IngestAiSnapshotDto) {
    // Check for idempotency - if event_id already exists, return existing record
    const existing = await this.aiSnapshotsRepository.findByEventId(
      ingestDto.event_id,
    );

    if (existing) {
      // Return existing snapshot with 200 OK (idempotent)
      return {
        event_id: existing.event_id,
        status: existing.status || "processing",
      };
    }

    // Normalize plate_number: uppercase and remove spaces
    const normalizedPlateNumber = ingestDto.plate_number
      .toUpperCase()
      .replace(/\s/g, "");

    // Convert confidence_score from 0-100 to 0-1 if provided
    let confidenceScore = 0;
    if (ingestDto.confidence_score !== undefined) {
      confidenceScore = ingestDto.confidence_score / 100;
    }

    // Convert fill_level from 0-100 to 0-1 if provided
    let fillLevel: number | undefined = undefined;
    if (ingestDto.fill_level !== undefined) {
      fillLevel = ingestDto.fill_level / 100;
    }

    // Upload list_image to S3 if provided
    let listImageUrls: string[] | undefined = undefined;
    if (ingestDto.list_image && ingestDto.list_image.length > 0) {
      try {
        listImageUrls = await this.uploadBase64ImagesToS3(ingestDto.list_image);
        this.logger.log(
          `Uploaded ${listImageUrls.length} images to S3 for event_id: ${ingestDto.event_id}`,
        );
      } catch (error) {
        this.logger.error(
          `Error uploading images for event_id ${ingestDto.event_id}:`,
          error,
        );
        throw error;
      }
    }

    // Create new snapshot
    const snapshot = await this.aiSnapshotsRepository.create({
      event_id: ingestDto.event_id,
      event_type: ingestDto.event_type,
      image_url: ingestDto.image_url,
      plate_number: normalizedPlateNumber,
      camera_code: ingestDto.camera_code,
      timestamp: ingestDto.timestamp,
      direction: ingestDto.direction,
      fill_level: fillLevel,
      volume: ingestDto.volume,
      confidence_score: confidenceScore,
      status: "processed",
      list_image_urls: listImageUrls,
    });

    // If event type is "normal", update camera's latest_captured_image and latest_captured_image_at
    if (ingestDto.event_type === "normal") {
      try {
        // Find camera by camera_code
        const cameras = await this.aiCameraRepository.findAllWithFilterAndPagination({
          filter: { code: ingestDto.camera_code },
          paginationOptions: { page: 1, limit: 1 },
        });

        if (cameras.length > 0) {
          const camera = cameras[0];
          // Determine which image to use: prefer image_url, fallback to first list_image_url
          const imageToUse = ingestDto.image_url || (listImageUrls && listImageUrls.length > 0 ? listImageUrls[0] : "");
          // Parse timestamp to Date
          const capturedAt = new Date(ingestDto.timestamp);

          // Update camera
          await this.aiCameraRepository.update(camera.id, {
            latest_captured_image: imageToUse,
            latest_captured_image_at: capturedAt,
          });

          this.logger.log(
            `Updated camera ${ingestDto.camera_code} latest_captured_image for normal event ${ingestDto.event_id}`,
          );
        } else {
          this.logger.warn(
            `Camera with code ${ingestDto.camera_code} not found for normal event ${ingestDto.event_id}`,
          );
        }
      } catch (error) {
        // Log error but don't fail the snapshot ingestion
        this.logger.error(
          `Error updating camera latest_captured_image for event_id ${ingestDto.event_id}:`,
          error,
        );
      }
    }

    // Convert to alert if applicable
    try {
      await this.convertSnapshotToAlert(snapshot);
    } catch (error) {
      // Log error but don't fail the snapshot ingestion
      this.logger.error(
        `Error converting snapshot to alert for event_id ${ingestDto.event_id}:`,
        error,
      );
    }

    return {
      event_id: snapshot.event_id,
      status: snapshot.status || "processing",
    };
  }

  /**
   * Format camera code from number to CAM-KLMINING-XXX format
   * Example: "7" -> "CAM-KLMINING-007"
   */
  private formatCameraCode(cameraCode: string): string {
    // If it's already in CAM-KLMINING-XXX format, return as is
    if (cameraCode.startsWith("CAM-KLMINING-")) {
      return cameraCode;
    }

    // If it's just a number, format it
    const num = parseInt(cameraCode, 10);
    if (!isNaN(num)) {
      return `CAM-KLMINING-${String(num).padStart(3, "0")}`;
    }

    // Otherwise return as is
    return cameraCode;
  }

  /**
   * Clean plate number to keep only alphanumeric characters
   * Example: "61H00237_" -> "61H00237"
   */
  private cleanPlateNumber(plateNumber: string): string {
    // Remove all special characters, keep only letters and numbers
    return plateNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }

  /**
   * Convert ai-snapshot to alert based on event_type
   */
  async convertSnapshotToAlert(snapshot: AiSnapshots): Promise<void> {
    // Skip if already converted
    if (snapshot.alert_converted) {
      return;
    }

    // Skip normal events
    if (snapshot.event_type === "normal") {
      return;
    }

    // Find camera by camera_code to get site_id
    const defaultSiteId = "68c674493c0add08546ef592";
    let siteId: string | null = null;
    let cameraId: string | null = null;
    let formattedCameraCode: string | null = null;

    if (snapshot.camera_code) {
      // Format camera code: "7" -> "CAM-KLMINING-007"
      formattedCameraCode = this.formatCameraCode(snapshot.camera_code);

      // Try to find camera with formatted code first
      let cameras = await this.aiCameraRepository.findAllWithFilterAndPagination({
        filter: { code: formattedCameraCode },
        paginationOptions: { page: 1, limit: 1 },
      });

      // If not found, try with original code
      if (cameras.length === 0 && formattedCameraCode !== snapshot.camera_code) {
        cameras = await this.aiCameraRepository.findAllWithFilterAndPagination({
          filter: { code: snapshot.camera_code },
          paginationOptions: { page: 1, limit: 1 },
        });
      }

      if (cameras.length > 0) {
        const camera = cameras[0];
        cameraId = camera.id;
        siteId = camera.site_id?.id || null;
      }
    } else if (snapshot.camera_id) {
      cameraId = snapshot.camera_id.id;
      siteId = snapshot.camera_id.site_id?.id || null;
      // Get formatted camera code from camera object if available
      if (snapshot.camera_id.code) {
        formattedCameraCode = this.formatCameraCode(snapshot.camera_id.code);
      }
    }

    // Use default site_id if no site_id found from camera
    if (!siteId) {
      siteId = defaultSiteId;
      this.logger.warn(
        `No site_id found for snapshot ${snapshot.id}, using default site_id: ${defaultSiteId}`,
      );
    }

    // Find truck by plate_number if provided
    let truckId: string | null = null;
    let truckType: "dump_truck" | "loader" | "hauler" | null = null;
    let cleanedPlateNumber: string | null = null;

    if (snapshot.plate_number && snapshot.plate_number !== "UNKNOWN") {
      // Clean plate number: remove special characters, keep only alphanumeric
      cleanedPlateNumber = this.cleanPlateNumber(snapshot.plate_number);
      
      // Skip truck finding/creation for special breach plates (normal cars, not trucks)
      const isSpecialBreachPlate = cleanedPlateNumber && 
        this.SPECIAL_BREACH_PLATE_NUMBERS.includes(cleanedPlateNumber);
      
      if (!isSpecialBreachPlate) {
        // Get all trucks and find matching one
        const trucksResult = await this.trucksService.findAllWithFilterAndPagination(
          {},
          { page: 1, limit: 1000 },
        );
        
        // Find truck by cleaned plate number
        const matchingTruck = trucksResult.entities.find(
          (t) => this.cleanPlateNumber(t.plate_number) === cleanedPlateNumber,
        );
        
        if (matchingTruck) {
          truckId = matchingTruck.id;
          // Map truck type to alert truck type
          if (matchingTruck.type === "dump_truck" || matchingTruck.type === "hauler" || matchingTruck.type === "loader") {
            truckType = matchingTruck.type as "dump_truck" | "loader" | "hauler";
          } else {
            truckType = "dump_truck"; // default
          }
        } else {
          // Create new truck if not found
          try {
            const newTruck = await this.trucksService.create({
              plate_number: cleanedPlateNumber,
              type: "dump_truck", // default type
              status: TruckStatus.IDLE,
              site_id: [siteId || defaultSiteId], // Use current site_id or default
              driver_name: null,
              last_activity_at: null,
              volume_recorded: null,
            });
            truckId = newTruck.id;
            truckType = "dump_truck";
            this.logger.log(
              `Created new truck with plate_number: ${cleanedPlateNumber} for snapshot ${snapshot.id}`,
            );
          } catch (error) {
            this.logger.error(
              `Error creating new truck with plate_number ${cleanedPlateNumber}:`,
              error,
            );
            // Continue without truck_id
          }
        }
      } else {
        this.logger.log(
          `Skipping truck creation for special breach plate: ${cleanedPlateNumber} (normal car, not truck)`,
        );
      }
    }

    // Use formatted camera code in descriptions
    const displayCameraCode = formattedCameraCode || (snapshot.camera_code ? this.formatCameraCode(snapshot.camera_code) : "unknown");

    // Determine if plate_number is UNKNOWN - if so, force breach_event
    const isUnknownPlate = !snapshot.plate_number || snapshot.plate_number === "UNKNOWN";

    // Clean plate number for special case check (if not already cleaned)
    const plateNumberForCheck = cleanedPlateNumber || 
      (snapshot.plate_number && snapshot.plate_number !== "UNKNOWN" 
        ? this.cleanPlateNumber(snapshot.plate_number) 
        : null);

    // Check if plate_number is in special breach list (normal cars, not trucks)
    const isSpecialBreachPlate = plateNumberForCheck && 
      this.SPECIAL_BREACH_PLATE_NUMBERS.includes(plateNumberForCheck);

    // Determine alert type and breach type based on event_type
    // Override: if plate_number is UNKNOWN or in special breach list, it's always breach_event
    let alertType: "truck_activity" | "breach_event";
    let breachType: "unauthorized_access" | "equipment_tampering" | "perimeter_breach" | "restricted_zone_entry" | null = null;
    let severity: "low" | "medium" | "high" | "critical" = "medium";
    let title = "";
    let description = "";
    let overloaded: boolean | null = null;

    // If plate_number is UNKNOWN or in special breach list, force breach_event
    if (isUnknownPlate || isSpecialBreachPlate) {
      alertType = "breach_event";
      breachType = "unauthorized_access";
      if (isSpecialBreachPlate) {
        title = "Normal Car Detected";
        description = `Normal car with plate ${plateNumberForCheck} detected at camera ${displayCameraCode}`;
      } else {
        title = "Unknown Vehicle Detected";
        description = `Unknown vehicle detected at camera ${displayCameraCode}`;
      }
      severity = "high";
    } else {
      // If it has plate_number, it's truck_activity (don't use event_type)
      alertType = "truck_activity";
      title = snapshot.direction === "in" ? "Truck Entered" : "Truck Out";
      description = `Truck ${cleanedPlateNumber || snapshot.plate_number} ${snapshot.direction === "in" ? "entered" : "exited"} at camera ${displayCameraCode}`;
      if (snapshot.fill_level !== undefined && snapshot.fill_level !== null) {
        description += ` with fill level ${Math.round(snapshot.fill_level * 100)}%`;
      }
      severity = "low";
    }

    // Prepare evidence URLs
    const evidenceUrls: string[] = [];
    if (snapshot.list_image_urls && snapshot.list_image_urls.length > 0) {
      evidenceUrls.push(...snapshot.list_image_urls);
    } else if (snapshot.image_url) {
      evidenceUrls.push(snapshot.image_url);
    }

    // Convert fill_level from 0-1 to 0-100 (always multiply by 100)
    let fillLevel: number | null = null;
    if (snapshot.fill_level !== undefined && snapshot.fill_level !== null) {
      fillLevel = Math.round(snapshot.fill_level * 100);
    }

    // Convert confidence_score from 0-1 to 0-100
    const confidence = snapshot.confidence_score ? Math.round(snapshot.confidence_score * 100) : null;

    // Keep volume same value (no conversion needed)
    const volume = snapshot.volume !== undefined && snapshot.volume !== null ? snapshot.volume : null;

    // Use timestamp from snapshot (parse ISO-8601 string to Date)
    const timestamp = snapshot.timestamp ? new Date(snapshot.timestamp) : (snapshot.createdAt || new Date());

    // Check for duplicate ai-snapshots BEFORE creating alert: same plate_number within 1 minute of timestamp
    const oneMinuteAgo = new Date(timestamp.getTime() - 60 * 1000);
    const oneMinuteLater = new Date(timestamp.getTime() + 60 * 1000);
    
    // Convert to ISO-8601 strings for comparison (timestamp is stored as string)
    const oneMinuteAgoISO = oneMinuteAgo.toISOString();
    const oneMinuteLaterISO = oneMinuteLater.toISOString();

    try {
      // Check for other ai-snapshots with same plate_number within 1 minute that are already converted
      const plateNumberToCheck = isUnknownPlate ? "UNKNOWN" : (cleanedPlateNumber || snapshot.plate_number);
      
      // Build filter for checking duplicates
      const duplicateFilter: any = {
        _id: { $ne: snapshot.id }, // Exclude current snapshot
        alert_converted: true, // Only check already converted ones
        timestamp: {
          $gte: oneMinuteAgoISO,
          $lte: oneMinuteLaterISO,
        },
      };

      // Add plate_number filter
      if (isUnknownPlate) {
        duplicateFilter.$or = [
          { plate_number: "UNKNOWN" },
          { plate_number: null },
          { plate_number: { $exists: false } },
        ];
      } else {
        duplicateFilter.$or = [
          { plate_number: plateNumberToCheck },
          { plate_number: snapshot.plate_number }, // Also check original plate_number
        ];
      }

      const existingSnapshots = await this.aiSnapshotsRepository.findAllWithFilterAndPagination({
        filter: duplicateFilter,
        paginationOptions: { page: 1, limit: 10 },
      });

      // If we found a converted snapshot with same plate_number within 1 minute, skip creating alert
      if (existingSnapshots.length > 0) {
        this.logger.log(
          `Skipping duplicate alert for snapshot ${snapshot.id} (plate_number: ${plateNumberToCheck}, timestamp: ${timestamp.toISOString()}) - found ${existingSnapshots.length} converted snapshot(s) within 1 minute`,
        );
        // Mark snapshot as converted even though we didn't create an alert (to avoid reprocessing)
        await this.aiSnapshotsRepository.update(snapshot.id, {
          alert_converted: true,
        });
        return;
      }
    } catch (error) {
      this.logger.error(
        `Error checking for duplicate snapshots for snapshot ${snapshot.id}:`,
        error,
      );
      // Continue with alert creation if duplicate check fails
    }

    // Create alert
    try {
      await this.alertsService.create({
        alert_type: alertType,
        title,
        description,
        site_id: siteId,
        timestamp,
        severity,
        status: "new",
        camera_id: cameraId,
        truck_id: truckId,
        truck_type: truckType,
        direction: snapshot.direction && snapshot.direction !== "n/a" ? snapshot.direction as "in" | "out" : null,
        fill_level: fillLevel,
        confidence,
        volume,
        breach_type: breachType,
        evidence_url: evidenceUrls.length > 0 ? evidenceUrls : null,
        overloaded,
      });

      // Mark snapshot as converted
      await this.aiSnapshotsRepository.update(snapshot.id, {
        alert_converted: true,
      });

      this.logger.log(
        `Successfully converted snapshot ${snapshot.id} (event_id: ${snapshot.event_id}) to alert`,
      );
    } catch (error) {
      this.logger.error(
        `Error creating alert for snapshot ${snapshot.id}:`,
        error,
      );
      throw error;
    }
  }

  async getReceiptStatus(eventId: string): Promise<ReceiptResponseDto> {
    const snapshot = await this.aiSnapshotsRepository.findByEventId(eventId);

    if (!snapshot) {
      throw new NotFoundException(`Snapshot with event_id ${eventId} not found`);
    }

    return {
      event_id: snapshot.event_id || eventId,
      status: snapshot.status || "processing",
      received_at: snapshot.createdAt.toISOString(),
      event_type: snapshot.event_type,
      direction: snapshot.direction || "in",
      plate_number: snapshot.plate_number || "",
      camera_code: snapshot.camera_code || "",
      confidence_score: snapshot.confidence_score
        ? snapshot.confidence_score * 100
        : undefined,
      list_image_urls: snapshot.list_image_urls || undefined,
    };
  }

  async findByEventId(eventId: string) {
    return this.aiSnapshotsRepository.findByEventId(eventId);
  }

  /**
   * Upload base64 image to S3 and return the URL
   */
  private async uploadBase64ImageToS3(
    base64Image: string,
    index: number,
  ): Promise<string> {
    try {
      // Parse base64 string
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Determine file extension from base64 header or default to jpg
      const mimeMatch = base64Image.match(/data:image\/(\w+);base64,/);
      const extension = mimeMatch ? mimeMatch[1] : "jpg";
      const contentType = `image/${extension}`;

      // Generate unique key
      const key = `ai-snapshots/${randomStringGenerator()}_${index}.${extension}`;

      if (this.useS3 && this.s3Client) {
        // Upload to S3 (bucket must have public read policy configured)
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: imageBuffer,
          ContentType: contentType,
          // Note: ACL removed - bucket must have public read policy instead
        });

        await this.s3Client.send(command);

        // Generate permanent public URL (no expiration)
        // Bucket must be configured for public read access via bucket policy
        const region = this.configService.get("file.awsS3Region", { infer: true }) || "us-east-1";
        // Handle us-east-1 special case (no region in URL)
        const publicUrl = region === "us-east-1"
          ? `https://${this.bucketName}.s3.amazonaws.com/${key}`
          : `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;

        this.logger.log(`Image uploaded successfully to S3: ${publicUrl}`);
        return publicUrl;
      } else {
        // Fallback to local storage
        const fs = require("fs");
        const path = require("path");

        const snapshotsDir = path.join(process.cwd(), "files", "ai-snapshots");
        if (!fs.existsSync(snapshotsDir)) {
          fs.mkdirSync(snapshotsDir, { recursive: true });
        }

        const fileName = `${randomStringGenerator()}_${index}.${extension}`;
        const filePath = path.join(snapshotsDir, fileName);
        fs.writeFileSync(filePath, imageBuffer);

        const fileUrl = `/files/ai-snapshots/${fileName}`;
        this.logger.log(`Image saved locally: ${filePath}`);
        return fileUrl;
      }
    } catch (error) {
      this.logger.error(`Error uploading image ${index} to S3:`, error);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          list_image: `Failed to upload image at index ${index}`,
        },
      });
    }
  }

  /**
   * Upload multiple base64 images to S3 and return array of URLs
   */
  private async uploadBase64ImagesToS3(
    base64Images: string[],
  ): Promise<string[]> {
    const uploadPromises = base64Images.map((image, index) =>
      this.uploadBase64ImageToS3(image, index),
    );
    return Promise.all(uploadPromises);
  }

  /**
   * Process snapshots by date filter and convert to alerts
   * Used by CLI command
   */
  async processSnapshotsByDate(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ processed: number; errors: number }> {
    const filter: any = {
      alert_converted: { $ne: true }, // Only process unconverted snapshots
    };

    // Add date filter if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = startDate;
      }
      if (endDate) {
        filter.createdAt.$lte = endDate;
      }
    }

    let processed = 0;
    let errors = 0;
    let page = 1;
    const limit = 100;

    this.logger.log(
      `Starting to process snapshots${startDate || endDate ? ` from ${startDate?.toISOString()} to ${endDate?.toISOString()}` : ""}`,
    );

    while (true) {
      const snapshots = await this.aiSnapshotsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions: { page, limit },
      });

      if (snapshots.length === 0) {
        break;
      }

      this.logger.log(`Processing page ${page}, ${snapshots.length} snapshots`);

      for (const snapshot of snapshots) {
        try {
          await this.convertSnapshotToAlert(snapshot);
          processed++;
        } catch (error) {
          errors++;
          this.logger.error(
            `Error processing snapshot ${snapshot.id}:`,
            error,
          );
        }
      }

      page++;
    }

    this.logger.log(
      `Finished processing: ${processed} converted, ${errors} errors`,
    );

    return { processed, errors };
  }
}
