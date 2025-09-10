import { MiningSitesService } from "../mining-sites/mining-sites.service";
import { MiningSites } from "../mining-sites/domain/mining-sites";

import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateTrucksDto } from "./dto/create-trucks.dto";
import { UpdateTrucksDto } from "./dto/update-trucks.dto";
import { TrucksRepository } from "./infrastructure/persistence/trucks.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Trucks } from "./domain/trucks";
import { FindAllTrucksDto } from "./dto/find-all-trucks.dto";
import { UnprocessableEntityException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";

@Injectable()
export class TrucksService {
  constructor(
    private readonly miningSitesService: MiningSitesService,

    // Dependencies here
    private readonly trucksRepository: TrucksRepository,
  ) {}

  async create(createTrucksDto: CreateTrucksDto) {
    // Do not remove comment below.
    // <creating-property />

    const site_idObjects = await this.miningSitesService.findByIds(
      createTrucksDto.site_id
    );
    if (site_idObjects.length !== createTrucksDto.site_id.length) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          site_id: "notExists",
        },
      });
    }
    const site_id = site_idObjects;

    return this.trucksRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      last_activity_at: createTrucksDto.last_activity_at,

      volume_recorded: createTrucksDto.volume_recorded,

      type: createTrucksDto.type,

      status: createTrucksDto.status,

      site_id,

      driver_name: createTrucksDto.driver_name,

      plate_number: createTrucksDto.plate_number,
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

  async findAllWithFilterAndPagination(
    query: FindAllTrucksDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entites, total] = await Promise.all([
      this.trucksRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.trucksRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: Trucks["id"]) {
    return this.trucksRepository.findById(id);
  }

  findByIds(ids: Trucks["id"][]) {
    return this.trucksRepository.findByIds(ids);
  }

  async update(
    id: Trucks["id"],

    updateTrucksDto: UpdateTrucksDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let site_id: MiningSites[] | undefined = undefined;

    if (updateTrucksDto.site_id) {
      const site_idObjects = await this.miningSitesService.findByIds(
        updateTrucksDto.site_id
      );
      if (site_idObjects.length !== updateTrucksDto.site_id.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            site_id: "notExists",
          },
        });
      }
      site_id = site_idObjects;
    }

    return this.trucksRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      last_activity_at: updateTrucksDto.last_activity_at,

      volume_recorded: updateTrucksDto.volume_recorded,

      type: updateTrucksDto.type,

      status: updateTrucksDto.status,

      site_id,

      driver_name: updateTrucksDto.driver_name,

      plate_number: updateTrucksDto.plate_number,
    });
  }

  remove(id: Trucks["id"]) {
    return this.trucksRepository.remove(id);
  }
}
