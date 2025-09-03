import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateTrucksDto } from "./dto/create-trucks.dto";
import { UpdateTrucksDto } from "./dto/update-trucks.dto";
import { TrucksRepository } from "./infrastructure/persistence/trucks.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Trucks } from "./domain/trucks";

@Injectable()
export class TrucksService {
  constructor(
    // Dependencies here
    private readonly trucksRepository: TrucksRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createTrucksDto: CreateTrucksDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.trucksRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.trucksRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Trucks["id"]) {
    return this.trucksRepository.findById(id);
  }

  findByIds(ids: Trucks["id"][]) {
    return this.trucksRepository.findByIds(ids);
  }

  async update(
    id: Trucks["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateTrucksDto: UpdateTrucksDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.trucksRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Trucks["id"]) {
    return this.trucksRepository.remove(id);
  }
}
