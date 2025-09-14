import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateProvincesDto } from "./dto/create-provinces.dto";
import { UpdateProvincesDto } from "./dto/update-provinces.dto";
import { ProvincesRepository } from "./infrastructure/persistence/provinces.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Provinces } from "./domain/provinces";
import { FindAllProvincesDto } from "./dto/find-all-provinces.dto";
import { FindAllAiCamerasDto } from "../ai-cameras/dto/find-all-ai-cameras.dto";
import { AiCamerasRepository } from "../ai-cameras/infrastructure/persistence/ai-cameras.repository";
import { MiningSitesRepository } from "../mining-sites/infrastructure/persistence/mining-sites.repository";
import { ProvincesMaterialsResponseDto } from "./dto/provinces-materials-response.dto";
import { ProvincesStatisticsResponseDto } from "./dto/provinces-statistics-response.dto";
import { FindStatisticsDto } from "./dto/find-statistics.dto";
import { FindAllAlertsDto } from "../alerts/dto/find-all-alerts.dto";
import { AlertsRepository } from "../alerts/infrastructure/persistence/alerts.repository";
import { AlertSummaryDto } from "../alerts/dto/alert-summary.dto";
import { MiningSitesService } from "../mining-sites/mining-sites.service";

@Injectable()
export class ProvincesService {
  constructor(
    // Dependencies here
    private readonly provincesRepository: ProvincesRepository,
    private readonly miningSitesRepository: MiningSitesRepository,
    private readonly aiCamerasRepository: AiCamerasRepository,
    private readonly alertsRepository: AlertsRepository,
  ) {}

  async create(createProvincesDto: CreateProvincesDto) {
    return this.provincesRepository.create({
      province_name: createProvincesDto.province_name,
      province_code: createProvincesDto.province_code,
      status: createProvincesDto.status,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.provincesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllProvincesDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entites, total] = await Promise.all([
      this.provincesRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.provincesRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: Provinces["id"]) {
    return this.provincesRepository.findById(id);
  }

  findByIds(ids: Provinces["id"][]) {
    return this.provincesRepository.findByIds(ids);
  }

  async update(
    id: Provinces["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateProvincesDto: UpdateProvincesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.provincesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Provinces["id"]) {
    return this.provincesRepository.remove(id);
  }

  async getStatistics(
    provinceId: string,
    query: FindStatisticsDto,
  ): Promise<ProvincesStatisticsResponseDto> {
    const dateFilter = query.date ?? new Date().toISOString().slice(0, 10);

    const totalSites = await this.miningSitesRepository.countWithFilter({
      province: provinceId,
    });
    const operationalSites = await this.miningSitesRepository.countWithFilter({
      province: provinceId,
      status: "active",
    });
    const listSites = await this.miningSitesRepository.findAllWithFilterAndPagination({
      filter: {
        province: provinceId,
      },
      paginationOptions: {
        page: 1,
        limit: 10000,
      },
    });
    const listSitesIds = listSites.map((site) => site.id);
   

    const currentDate = new Date(dateFilter);
    const nextDate = new Date(dateFilter);
    nextDate.setDate(nextDate.getDate() + 1);
    const previousDate = new Date(dateFilter);
    previousDate.setDate(previousDate.getDate() - 1);

    const breachAlerts = await this.alertsRepository.countWithFilter({
      site_id: { $in: listSitesIds },
      alert_type: "breach_event",
      from_date: currentDate,
      to_date: nextDate,
    });
    const yesterdayBreachAlerts = await this.alertsRepository.countWithFilter({
      site_id: { $in: listSitesIds },
      alert_type: "breach_event",
      from_date: previousDate,
      to_date: currentDate,
    });
    let changeBreachAlerts = 0;
    if(yesterdayBreachAlerts > 0){
      changeBreachAlerts = (breachAlerts - yesterdayBreachAlerts) / yesterdayBreachAlerts * 100;
    }

    const truckActivities = await this.alertsRepository.countWithFilter({
      site_id: { $in: listSitesIds },
      alert_type: "truck_activity",
      from_date: currentDate,
      to_date: nextDate,
    });

    const yesterdayTruckActivities = await this.alertsRepository.countWithFilter({
      site_id: { $in: listSitesIds },
      alert_type: "truck_activity",
      from_date: previousDate,
      to_date: currentDate,
    });
    let changeTruckActivities = 0;
    if(yesterdayTruckActivities > 0){
      changeTruckActivities = (truckActivities - yesterdayTruckActivities) / yesterdayTruckActivities * 100;
    }

    const volumePerCar = MiningSitesService.VOLUME_PER_CAR;
    const quotaMiningSitePerDay = MiningSitesService.QUOTA_MINING_SITE_PER_DAY;

    const volumeTruckOut = await this.alertsRepository.findAllWithFilterAndPagination({
      filter: {
        site_id: { $in: listSitesIds },
        alert_type: "truck_activity",
        direction: "out",
        from_date: currentDate,
        to_date: nextDate,
      },
      paginationOptions: {
        page: 1,
        limit: 10000,
      },
    });
    const totalVolumeTruckOut = Math.floor(volumeTruckOut.reduce((acc, curr) => acc + volumePerCar * (curr.fill_level ? curr.fill_level/100 : 0), 0));
    const percentageQuota = Math.floor((totalVolumeTruckOut / quotaMiningSitePerDay) * 100) ;
    
    return {
      province_id: provinceId,
      last_updated: new Date().toISOString(),
      site_status: {
        total_sites: totalSites,
        operational_sites: operationalSites,
        status_text: "All system operational",
      },
      breach_alerts: {
        count: breachAlerts,
        change: changeBreachAlerts,
      },
      truck_activities: {
        count: truckActivities,
        change: changeTruckActivities,
      },
      total_volume: {
        value: totalVolumeTruckOut,
        unit: "m3",
        percentage_quota: percentageQuota,
      },
    };
  }

  async getLiveAiCameras(
    query: FindAllAiCamerasDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};
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

  async getMaterials(
    provinceId: string,
  ): Promise<ProvincesMaterialsResponseDto> {
    return {
      province_id: provinceId,
      last_updated: new Date().toISOString(),
      materials: [
        {
          name: "Kaolin",
          percentage: 80,
          price: "N/A",
          unit: "ton"
        },
        {
          name: "Bentonite", 
          percentage: 20,
          price: "N/A",
          unit: "ton"
        }
      ],
    };
  }

  async getAlerts(
    provinceId: string,
    query: FindAllAlertsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};
    if (query.province_id) {
      const sites = await this.miningSitesRepository.findByProvinceId(
        query.province_id,
      );
      if (sites.length) {
        filter.site_id = { $in: sites.map((site) => site.id) };
      }
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

  async getAlertSummary(provinceId: string): Promise<AlertSummaryDto> {
    let siteIds: string[] = [];
    if (provinceId) {
      const sites =
        await this.miningSitesRepository.findByProvinceId(provinceId);
      if (sites.length > 0) {
        siteIds = sites.map((site) => site.id);
      }
    }
    const [breachAlertData, truckActivitiesData] = await Promise.all([
      this.alertsRepository.getBreachAlertSummary("province", siteIds),
      this.alertsRepository.getTruckActivitiesSummary("province", siteIds),
    ]);

    return {
      breach_alert_summary: {
        total_alerts: breachAlertData.total_alerts,
        critical_alerts: breachAlertData.critical_alerts,
        high_confidence_alerts: breachAlertData.high_confidence_alerts,
        acknowledged_resolved: breachAlertData.acknowledged_resolved,
      },
      truck_activity_summary: {
        trucks_in: truckActivitiesData.trucks_in,
        trucks_out: truckActivitiesData.trucks_out,
        truck_in_activities: truckActivitiesData.truck_in_activities,
        truck_overloaded: truckActivitiesData.truck_overloaded,
      },
    };
  }
}
