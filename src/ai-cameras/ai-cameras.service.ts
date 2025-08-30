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

@Injectable()
export class AiCamerasService {
  constructor(
    // Dependencies here
    private readonly aiCamerasRepository: AiCamerasRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createAiCamerasDto: CreateAiCamerasDto,
  ) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAiCamerasDto: UpdateAiCamerasDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.aiCamerasRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: AiCameras["id"]) {
    return this.aiCamerasRepository.remove(id);
  }
}
