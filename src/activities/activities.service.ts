import { TrucksService } from "../trucks/trucks.service";
import { Trucks } from "../trucks/domain/trucks";

import { AiCamerasService } from "../ai-cameras/ai-cameras.service";
import { AiCameras } from "../ai-cameras/domain/ai-cameras";

import { MiningSitesService } from "../mining-sites/mining-sites.service";
import { MiningSites } from "../mining-sites/domain/mining-sites";

import {
  // common
  Injectable,
  forwardRef,
  Inject,
} from "@nestjs/common";
import { CreateActivitiesDto } from "./dto/create-activities.dto";
import { UpdateActivitiesDto } from "./dto/update-activities.dto";
import { ActivitiesRepository } from "./infrastructure/persistence/activities.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Activities } from "./domain/activities";
import { FindAllActivitiesDto } from "./dto/find-all-activities.dto";
import { UnprocessableEntityException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";

@Injectable()
export class ActivitiesService {
  constructor(
    @Inject(forwardRef(() => TrucksService))
    private readonly trucksService: TrucksService,
    @Inject(forwardRef(() => AiCamerasService))
    private readonly aiCamerasService: AiCamerasService,
    @Inject(forwardRef(() => MiningSitesService))
    private readonly miningSitesService: MiningSitesService,
    // Dependencies here
    private readonly activitiesRepository: ActivitiesRepository,
  ) {}

  async create(createActivitiesDto: CreateActivitiesDto) {
    // Do not remove comment below.
    // <creating-property />

    let truck_id: Trucks | null | undefined = undefined;

    if (createActivitiesDto.truck_id) {
      const truck_idObject = await this.trucksService.findById(
        createActivitiesDto.truck_id,
      );
      if (!truck_idObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            truck_id: "notExists",
          },
        });
      }
      truck_id = truck_idObject;
    } else if (createActivitiesDto.truck_id === null) {
      truck_id = null;
    }

    let camera_id: AiCameras | null | undefined = undefined;

    if (createActivitiesDto.camera_id) {
      const camera_idObject = await this.aiCamerasService.findById(
        createActivitiesDto.camera_id,
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
    } else if (createActivitiesDto.camera_id === null) {
      camera_id = null;
    }

    let site_id: MiningSites | null | undefined = undefined;

    const site_idObject = await this.miningSitesService.findById(
      createActivitiesDto.site_id as string,
    );
    if (!site_idObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          site_id: "notExists",
        },
      });
    }
    site_id = site_idObject;

    return this.activitiesRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      volume: createActivitiesDto.volume,

      truck_id,

      camera_id,

      site_id,

      status: createActivitiesDto.status,

      priority: createActivitiesDto.priority,

      message: createActivitiesDto.message,

      title: createActivitiesDto.title,

      event_type: createActivitiesDto.event_type,
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

    const [entities, total] = await Promise.all([
      this.activitiesRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.activitiesRepository.countWithFilter(filter),
    ]);

    return { entities, total };
  }

  findById(id: Activities["id"]) {
    return this.activitiesRepository.findById(id);
  }

  findByIds(ids: Activities["id"][]) {
    return this.activitiesRepository.findByIds(ids);
  }

  async update(
    id: Activities["id"],

    updateActivitiesDto: UpdateActivitiesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let truck_id: Trucks | null | undefined = undefined;

    if (updateActivitiesDto.truck_id) {
      const truck_idObject = await this.trucksService.findById(
        updateActivitiesDto.truck_id,
      );
      if (!truck_idObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            truck_id: "notExists",
          },
        });
      }
      truck_id = truck_idObject;
    } else if (updateActivitiesDto.truck_id === null) {
      truck_id = null;
    }

    let camera_id: AiCameras | null | undefined = undefined;

    if (updateActivitiesDto.camera_id) {
      const camera_idObject = await this.aiCamerasService.findById(
        updateActivitiesDto.camera_id,
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
    } else if (updateActivitiesDto.camera_id === null) {
      camera_id = null;
    }

    let site_id: MiningSites | undefined = undefined;

    if (updateActivitiesDto.site_id) {
      const site_idObject = await this.miningSitesService.findById(
        updateActivitiesDto.site_id,
      );
      if (!site_idObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            site_id: "notExists",
          },
        });
      }
      site_id = site_idObject;
    }

    return this.activitiesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      volume: updateActivitiesDto.volume,

      truck_id,

      camera_id,

      site_id,

      status: updateActivitiesDto.status,

      priority: updateActivitiesDto.priority,

      message: updateActivitiesDto.message,

      title: updateActivitiesDto.title,

      event_type: updateActivitiesDto.event_type,
    });
  }

  remove(id: Activities["id"]) {
    return this.activitiesRepository.remove(id);
  }
}
