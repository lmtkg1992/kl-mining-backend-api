import { ActivitiesService } from "../activities/activities.service";
import { Activities } from "../activities/domain/activities";

import { AiCamerasService } from "../ai-cameras/ai-cameras.service";
import { AiCameras } from "../ai-cameras/domain/ai-cameras";

import { TrucksService } from "../trucks/trucks.service";
import { Trucks } from "../trucks/domain/trucks";

import { MiningSitesService } from "../mining-sites/mining-sites.service";
import { MiningSites } from "../mining-sites/domain/mining-sites";

import {
  // common
  Injectable,
  forwardRef,
  Inject,
} from "@nestjs/common";
import { CreateAlertsDto } from "./dto/create-alerts.dto";
import { UpdateAlertsDto } from "./dto/update-alerts.dto";
import { AlertsRepository } from "./infrastructure/persistence/alerts.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Alerts } from "./domain/alerts";
import { FindAllAlertsDto } from "./dto/find-all-alerts.dto";
import { UnprocessableEntityException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";

@Injectable()
export class AlertsService {
  constructor(
    @Inject(forwardRef(() => ActivitiesService))
    private readonly activitiesService: ActivitiesService,
    @Inject(forwardRef(() => AiCamerasService))
    private readonly aiCamerasService: AiCamerasService,
    @Inject(forwardRef(() => TrucksService))
    private readonly trucksService: TrucksService,
    @Inject(forwardRef(() => MiningSitesService))
    private readonly miningSitesService: MiningSitesService,
    // Dependencies here
    private readonly alertsRepository: AlertsRepository,
  ) {}

  async create(createAlertsDto: CreateAlertsDto) {
    // Do not remove comment below.
    // <creating-property />

    let event_id: Activities | null | undefined = undefined;

    if (createAlertsDto.event_id) {
      const event_idObject = await this.activitiesService.findById(
        createAlertsDto.event_id,
      );
      if (!event_idObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            event_id: "notExists",
          },
        });
      }
      event_id = event_idObject;
    } else if (createAlertsDto.event_id === null) {
      event_id = null;
    }

    let camera_id: AiCameras | null | undefined = undefined;

    if (createAlertsDto.camera_id) {
      const camera_idObject = await this.aiCamerasService.findById(
        createAlertsDto.camera_id,
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
    } else if (createAlertsDto.camera_id === null) {
      camera_id = null;
    }

    let truck_id: Trucks | null | undefined = undefined;

    if (createAlertsDto.truck_id) {
      const truck_idObject = await this.trucksService.findById(
        createAlertsDto.truck_id,
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
    } else if (createAlertsDto.truck_id === null) {
      truck_id = null;
    }

    const site_idObject = await this.miningSitesService.findById(
      createAlertsDto.site_id,
    );
    if (!site_idObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          site_id: "notExists",
        },
      });
    }
    const site_id = site_idObject;

    return this.alertsRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      alerts_resolution: createAlertsDto.alerts_resolution,

      evidence_url: createAlertsDto.evidence_url,

      breach_type: createAlertsDto.breach_type,

      direction: createAlertsDto.direction,

      overloaded: createAlertsDto.overloaded,

      fill_level: createAlertsDto.fill_level,

      confidence: createAlertsDto.confidence,

      status: createAlertsDto.status,

      severity: createAlertsDto.severity,

      event_id,

      camera_id,

      truck_type: createAlertsDto.truck_type,

      truck_id,

      site_id,

      timestamp: createAlertsDto.timestamp,

      description: createAlertsDto.description,

      title: createAlertsDto.title,

      alert_type: createAlertsDto.alert_type,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.alertsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllAlertsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};

    if (query.site_id) {
      filter.site_id = query.site_id;
    }
    if (query.alert_type) {
      filter.alert_type = query.alert_type;
    }

    const [entities, total] = await Promise.all([
      this.alertsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.alertsRepository.countWithFilter(filter),
    ]);

    return { entities, total };
  }

  findById(id: Alerts["id"]) {
    return this.alertsRepository.findById(id);
  }

  findByIds(ids: Alerts["id"][]) {
    return this.alertsRepository.findByIds(ids);
  }

  async update(
    id: Alerts["id"],

    updateAlertsDto: UpdateAlertsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let event_id: Activities | null | undefined = undefined;

    if (updateAlertsDto.event_id) {
      const event_idObject = await this.activitiesService.findById(
        updateAlertsDto.event_id,
      );
      if (!event_idObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            event_id: "notExists",
          },
        });
      }
      event_id = event_idObject;
    } else if (updateAlertsDto.event_id === null) {
      event_id = null;
    }

    let camera_id: AiCameras | null | undefined = undefined;

    if (updateAlertsDto.camera_id) {
      const camera_idObject = await this.aiCamerasService.findById(
        updateAlertsDto.camera_id,
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
    } else if (updateAlertsDto.camera_id === null) {
      camera_id = null;
    }

    let truck_id: Trucks | null | undefined = undefined;

    if (updateAlertsDto.truck_id) {
      const truck_idObject = await this.trucksService.findById(
        updateAlertsDto.truck_id,
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
    } else if (updateAlertsDto.truck_id === null) {
      truck_id = null;
    }

    let site_id: MiningSites | undefined = undefined;

    if (updateAlertsDto.site_id) {
      const site_idObject = await this.miningSitesService.findById(
        updateAlertsDto.site_id,
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

    return this.alertsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      alerts_resolution: updateAlertsDto.alerts_resolution,

      evidence_url: updateAlertsDto.evidence_url,

      breach_type: updateAlertsDto.breach_type,

      direction: updateAlertsDto.direction,

      overloaded: updateAlertsDto.overloaded,

      fill_level: updateAlertsDto.fill_level,

      confidence: updateAlertsDto.confidence,

      status: updateAlertsDto.status,

      severity: updateAlertsDto.severity,

      event_id,

      camera_id,

      truck_type: updateAlertsDto.truck_type,

      truck_id,

      site_id,

      timestamp: updateAlertsDto.timestamp,

      description: updateAlertsDto.description,

      title: updateAlertsDto.title,

      alert_type: updateAlertsDto.alert_type,
    });
  }

  remove(id: Alerts["id"]) {
    return this.alertsRepository.remove(id);
  }
}
