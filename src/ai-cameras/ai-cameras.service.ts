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

@Injectable()
export class AiCamerasService {
  constructor(
    // Dependencies here
    private readonly aiCamerasRepository: AiCamerasRepository,
    private readonly miningSitesRepository: MiningSitesRepository,
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
}
