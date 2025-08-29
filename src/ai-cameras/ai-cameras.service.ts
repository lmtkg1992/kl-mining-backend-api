import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateAiCamerasDto } from "./dto/create-ai-cameras.dto";
import { UpdateAiCamerasDto } from "./dto/update-ai-cameras.dto";
import { AiCamerasRepository } from "./infrastructure/persistence/ai-cameras.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { AiCameras } from "./domain/ai-cameras";

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
      // Do not remove comment below.
      // <creating-property-payload />
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
