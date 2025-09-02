import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateAiSnapshotsDto } from "./dto/create-ai-snapshots.dto";
import { UpdateAiSnapshotsDto } from "./dto/update-ai-snapshots.dto";
import { AiSnapshotsRepository } from "./infrastructure/persistence/ai-snapshots.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { AiSnapshots } from "./domain/ai-snapshots";
import { FindAllAiSnapshotsDto } from "./dto/find-all-ai-snapshots.dto";

@Injectable()
export class AiSnapshotsService {
  constructor(
    // Dependencies here
    private readonly aiSnapshotsRepository: AiSnapshotsRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createAiSnapshotsDto: CreateAiSnapshotsDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.aiSnapshotsRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
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
    const filter = {};

    const [entites, total] = await Promise.all([
      this.aiSnapshotsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.aiSnapshotsRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }


  findById(id: AiSnapshots["id"]) {
    return this.aiSnapshotsRepository.findById(id);
  }

  findByIds(ids: AiSnapshots["id"][]) {
    return this.aiSnapshotsRepository.findByIds(ids);
  }

  async update(
    id: AiSnapshots["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAiSnapshotsDto: UpdateAiSnapshotsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.aiSnapshotsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: AiSnapshots["id"]) {
    return this.aiSnapshotsRepository.remove(id);
  }
}
