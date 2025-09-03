import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateAlertsDto } from "./dto/create-alerts.dto";
import { UpdateAlertsDto } from "./dto/update-alerts.dto";
import { AlertsRepository } from "./infrastructure/persistence/alerts.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Alerts } from "./domain/alerts";
import { FindAllAlertsDto } from "./dto/find-all-alerts.dto";

@Injectable()
export class AlertsService {
  constructor(
    // Dependencies here
    private readonly alertsRepository: AlertsRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createAlertsDto: CreateAlertsDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.alertsRepository.create({
      type: createAlertsDto.type,
      title: createAlertsDto.title,
      description: createAlertsDto.description,
      site_id: createAlertsDto.site_id,
      severity: createAlertsDto.severity,
      resolved: createAlertsDto.resolved ?? false,
      truck_id: createAlertsDto.truck_id,
      timestamp: createAlertsDto.timestamp,
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
    const filter = {};

    const [entites, total] = await Promise.all([
      this.alertsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.alertsRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: Alerts["id"]) {
    return this.alertsRepository.findById(id);
  }

  findByIds(ids: Alerts["id"][]) {
    return this.alertsRepository.findByIds(ids);
  }

  async update(
    id: Alerts["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAlertsDto: UpdateAlertsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.alertsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Alerts["id"]) {
    return this.alertsRepository.remove(id);
  }
}
