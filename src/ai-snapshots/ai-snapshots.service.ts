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

@Injectable()
export class AiSnapshotsService {
  private readonly logger = new Logger(AiSnapshotsService.name);
  private readonly s3Client: S3Client | null = null;
  private readonly bucketName: string;
  private readonly useS3: boolean;

  constructor(
    @Inject(forwardRef(() => AiCamerasService))
    private readonly aiCamerasService: AiCamerasService,
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

    return {
      event_id: snapshot.event_id,
      status: snapshot.status || "processing",
    };
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
}
