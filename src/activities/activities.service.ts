import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateActivitiesDto } from "./dto/create-activities.dto";
import { UpdateActivitiesDto } from "./dto/update-activities.dto";
import { ActivitiesRepository } from "./infrastructure/persistence/activities.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Activities } from "./domain/activities";
import { FindAllActivitiesDto } from "./dto/find-all-activities.dto";

@Injectable()
export class ActivitiesService {
  constructor(
    // Dependencies here
    private readonly activitiesRepository: ActivitiesRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createActivitiesDto: CreateActivitiesDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.activitiesRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.activitiesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllActivitiesDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entites, total] = await Promise.all([
      this.activitiesRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.activitiesRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: Activities["id"]) {
    return this.activitiesRepository.findById(id);
  }

  findByIds(ids: Activities["id"][]) {
    return this.activitiesRepository.findByIds(ids);
  }

  async update(
    id: Activities["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateActivitiesDto: UpdateActivitiesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.activitiesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Activities["id"]) {
    return this.activitiesRepository.remove(id);
  }
}
