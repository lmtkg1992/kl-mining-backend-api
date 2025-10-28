import {
  // common
  Injectable,
  Inject,
  forwardRef,
  ConflictException,
  NotFoundException,
  HttpCode,
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

@Injectable()
export class AiSnapshotsService {
  constructor(
    @Inject(forwardRef(() => AiCamerasService))
    private readonly aiCamerasService: AiCamerasService,
    // Dependencies here
    private readonly aiSnapshotsRepository: AiSnapshotsRepository,
    private readonly aiCameraRepository: AiCamerasRepository,
  ) {}

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
    });

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
    };
  }

  async findByEventId(eventId: string) {
    return this.aiSnapshotsRepository.findByEventId(eventId);
  }
}
