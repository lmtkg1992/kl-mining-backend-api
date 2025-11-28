import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateAiCamerasDto } from "./dto/create-ai-cameras.dto";
import { UpdateAiCamerasDto } from "./dto/update-ai-cameras.dto";
import { AiCamerasRepository } from "./infrastructure/persistence/ai-cameras.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { AiCameras } from "./domain/ai-cameras";
import { FindAllAiCamerasDto } from "./dto/find-all-ai-cameras.dto";
import { MiningSites } from "../mining-sites/domain/mining-sites";
import { MiningSitesRepository } from "../mining-sites/infrastructure/persistence/mining-sites.repository";
import { AiCamerasSummaryDto } from "./dto/ai-cameras-summary.dto";
import { SynologyService, RecordingItem, RecordingStreamResponse } from "./services/synology.service";
import { GetCameraRecordingsDto } from "./dto/get-camera-recordings.dto";
import { GetRecordingStreamDto } from "./dto/get-recording-stream.dto";

@Injectable()
export class AiCamerasService {
  constructor(
    // Dependencies here
    private readonly aiCamerasRepository: AiCamerasRepository,
    private readonly miningSitesRepository: MiningSitesRepository,
    private readonly synologyService: SynologyService,
  ) {}

  async create(createAiCamerasDto: CreateAiCamerasDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.aiCamerasRepository.create({
      code: createAiCamerasDto.code,
      site_id: {
        id: createAiCamerasDto.site_id,
      } as MiningSites,
      type: createAiCamerasDto.type,
      location_description: createAiCamerasDto.location_description,
      ai_features: createAiCamerasDto.ai_features,
      status: createAiCamerasDto.status,
      url_live_stream: createAiCamerasDto.url_live_stream,
      latest_captured_image: createAiCamerasDto.latest_captured_image ?? "",
      latest_captured_image_at:
        createAiCamerasDto.latest_captured_image_at ?? new Date(),
      installed_at: createAiCamerasDto.installed_at,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.aiCamerasRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllAiCamerasDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};
    if (query.site_id) {
      filter.site_id = query.site_id;
    }
    if (query.province_id) {
      const sites = await this.miningSitesRepository.findByProvinceId(
        query.province_id,
      );
      if (sites.length) {
        filter.site_id = { $in: sites.map((site) => site.id) };
      }
    }
    if (query.status) {
      filter.status = query.status;
    }

    const [entities, total] = await Promise.all([
      this.aiCamerasRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.aiCamerasRepository.countWithFilter(filter),
    ]);

    return { entities, total };
  }

  findById(id: AiCameras["id"]) {
    return this.aiCamerasRepository.findById(id);
  }

  findByIds(ids: AiCameras["id"][]) {
    return this.aiCamerasRepository.findByIds(ids);
  }

  async update(
    id: AiCameras["id"],

    updateAiCamerasDto: UpdateAiCamerasDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.aiCamerasRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      type: updateAiCamerasDto.type,
      location_description: updateAiCamerasDto.location_description,
      ai_features: updateAiCamerasDto.ai_features,
      status: updateAiCamerasDto.status,
      url_live_stream: updateAiCamerasDto.url_live_stream,
      latest_captured_image: updateAiCamerasDto.latest_captured_image ?? "",
      latest_captured_image_at:
        updateAiCamerasDto.latest_captured_image_at ?? new Date(),
    });
  }

  remove(id: AiCameras["id"]) {
    return this.aiCamerasRepository.remove(id);
  }

  async getAiCamerasSummary(type: string, id?: string[]): Promise<AiCamerasSummaryDto> {
    return this.aiCamerasRepository.getAiCamerasSummary(type, id);
  }

  async getCameraRecordings(dto: GetCameraRecordingsDto): Promise<{ items: RecordingItem[]; total: number }> {
    // Get Synology camera ID from camera_code if provided, otherwise use camera_id
    let synologyCameraId: number | null = null;

    if (dto.camera_code) {
      synologyCameraId = this.synologyService.getSynologyCameraId(dto.camera_code);
      if (!synologyCameraId) {
        throw new Error(`Could not map camera code '${dto.camera_code}' to Synology camera ID`);
      }
    } else if (dto.camera_id) {
      synologyCameraId = dto.camera_id;
    } else {
      throw new Error("Either camera_code or camera_id must be provided");
    }

    // Parse time strings to timestamps
    let fromTime = 0;
    let toTime = 0;

    if (dto.from_time) {
      fromTime = isNaN(Number(dto.from_time))
        ? new Date(dto.from_time).getTime()
        : Number(dto.from_time);
    }

    if (dto.to_time) {
      toTime = isNaN(Number(dto.to_time))
        ? new Date(dto.to_time).getTime()
        : Number(dto.to_time);
    }

    // If no time range specified, default to last 24 hours
    if (!fromTime && !toTime) {
      toTime = Date.now();
      fromTime = toTime - 24 * 60 * 60 * 1000; // 24 hours ago
    } else if (!toTime) {
      toTime = Date.now();
    } else if (!fromTime) {
      fromTime = toTime - 24 * 60 * 60 * 1000; // 24 hours before toTime
    }

    return this.synologyService.getRecordings(
      synologyCameraId,
      fromTime,
      toTime,
      dto.limit || 100,
      dto.offset || 0,
    );
  }

  async getRecordingStream(dto: GetRecordingStreamDto): Promise<RecordingStreamResponse> {
    return this.synologyService.getRecordingStreamUrl(
      dto.recording_id,
      dto.ds_id || 0,
      dto.mount_id || 0,
    );
  }

  async getSynologyCameraId(cameraCode: string): Promise<{ camera_code: string; synology_camera_id: number | null }> {
    const synologyId = this.synologyService.getSynologyCameraId(cameraCode);
    return {
      camera_code: cameraCode,
      synology_camera_id: synologyId,
    };
  }

}
