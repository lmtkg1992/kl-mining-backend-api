import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMiningSitesDto } from "./dto/create-mining-sites.dto";
import { UpdateMiningSitesDto } from "./dto/update-mining-sites.dto";
import { MiningSitesRepository } from "./infrastructure/persistence/mining-sites.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { MiningSites } from "./domain/mining-sites";
import { FindAllMiningSitesDto } from "./dto/find-all-mining-sites.dto";
import { Provinces } from "../provinces/domain/provinces";
import { MiningSitesStatisticsResponseDto } from "./dto/mining-sites-statistics-response.dto";
import { MiningSitesTransportResponseDto } from "./dto/mining-sites-transport-response.dto";
import { FindStatisticsDto } from "./dto/find-statistics.dto";
import { FindAllAiCamerasDto } from "../ai-cameras/dto/find-all-ai-cameras.dto";
import { AiCamerasRepository } from "../ai-cameras/infrastructure/persistence/ai-cameras.repository";
import { MiningSitesMaterialsResponseDto } from "./dto/mining-sites-materials-response.dto";
import { AdminUsers } from "../admin-users/domain/admin-users";
import { MiningSitesBusyHoursResponseDto } from "./dto/mining-sites-busy-hours-response.dto";
import { ActivitiesRepository } from "../activities/infrastructure/persistence/activities.repository";
import { FindAllActivitiesDto } from "../activities/dto/find-all-activities.dto";
import { AiCamerasSummaryDto } from "../ai-cameras/dto/ai-cameras-summary.dto";
import { FindAllAlertsDto } from "../alerts/dto/find-all-alerts.dto";
import { AlertsRepository } from "../alerts/infrastructure/persistence/alerts.repository";
import { AlertSummaryDto } from "../alerts/dto/alert-summary.dto";

@Injectable()
export class MiningSitesService {
  constructor(
    // Dependencies here
    private readonly miningSitesRepository: MiningSitesRepository,
    private readonly aiCamerasRepository: AiCamerasRepository,
    private readonly activitiesRepository: ActivitiesRepository,
    private readonly alertsRepository: AlertsRepository,
  ) {}

  async create(createMiningSitesDto: CreateMiningSitesDto) {
    return this.miningSitesRepository.create({
      site_name: createMiningSitesDto.site_name,
      site_code: createMiningSitesDto.site_code,
      status: createMiningSitesDto.status,
      owner_user_id: {
        id: createMiningSitesDto.owner_user_id,
      } as AdminUsers,
      province: {
        id: createMiningSitesDto.province,
      } as Provinces,
      boundary_polygon: createMiningSitesDto.boundary_polygon,
      material_type: createMiningSitesDto.material_type,
      volume: 0,
      trucks: 0,
      breaches: 0,
      cameras_online: 0,
      last_activity: new Date(),
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.miningSitesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllMiningSitesDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    if (query.province_id) {
      filter["province"] = query.province_id;
    }

    const [entites, total] = await Promise.all([
      this.miningSitesRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.miningSitesRepository.countWithFilter(filter),
    ]);

    //mapping meta data
    const enhancedEntites = entites.map((entity) => ({
      ...entity,
      volume: Math.floor(Math.random() * 1000),
      trucks: Math.floor(Math.random() * 100),
      breaches: Math.floor(Math.random() * 20),
      cameras_online: Math.floor(Math.random() * 10),
      last_activity: new Date(),
    }));
    return { entites: enhancedEntites, total };
  }

  async findById(id: MiningSites["id"]) {
    const site = await this.miningSitesRepository.findById(id);
    if (!site) {
      throw new NotFoundException("Site not found");
    }
    return {
      ...site,
      volume: Math.floor(Math.random() * 1000),
      trucks: Math.floor(Math.random() * 100),
      breaches: Math.floor(Math.random() * 20),
      cameras_online: Math.floor(Math.random() * 10),
      last_activity: new Date(),
    };
  }

  findByIds(ids: MiningSites["id"][]) {
    return this.miningSitesRepository.findByIds(ids);
  }

  async update(
    id: MiningSites["id"],

    updateMiningSitesDto: UpdateMiningSitesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.miningSitesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      material_type: updateMiningSitesDto.material_type,
    });
  }

  remove(id: MiningSites["id"]) {
    return this.miningSitesRepository.remove(id);
  }

  async getStatistics(
    siteId: string,
    query: FindStatisticsDto,
  ): Promise<MiningSitesStatisticsResponseDto> {
    const dateFilter = query.date ?? new Date().toISOString().slice(0, 10);

    const activeCameras = Math.floor(Math.random() * 10);
    const totalCameras = Math.floor(Math.random() * 10);
    const needingMaintenanceCameras = Math.floor(Math.random() * 10);
    const offlineCameras = totalCameras - activeCameras;
    const statusCamerasText = `${activeCameras}/${totalCameras} active — ${needingMaintenanceCameras} need maintenance`;

    return {
      site_id: siteId,
      last_updated: new Date().toISOString(),
      site_status: {
        total_sites: 1,
        operational_sites: 1,
        status_text: "All system operational",
      },
      active_cameras: {
        active: activeCameras,
        total: totalCameras,
        needing_maintenance: needingMaintenanceCameras,
        offline: offlineCameras,
        status_text: statusCamerasText,
      },
      breach_alerts: {
        count: Math.floor(Math.random() * 10),
        change: Math.floor(Math.random() * 10),
      },
      truck_activities: {
        count: Math.floor(Math.random() * 10),
        change: Math.floor(Math.random() * 10),
      },
      total_volume: {
        value: Math.floor(Math.random() * 1000),
        unit: "m3",
        percentage_quota: 92,
      },
    };
  }

  async getTransport(siteId: string): Promise<MiningSitesTransportResponseDto> {
    return {
      site_id: siteId,
      last_updated: new Date().toISOString(),
      hourly_data: [
        { hour: "6 AM", value: Math.floor(Math.random() * 10) },
        { hour: "7 AM", value: Math.floor(Math.random() * 10) },
        { hour: "8 AM", value: Math.floor(Math.random() * 10) },
        { hour: "9 AM", value: Math.floor(Math.random() * 10) },
        { hour: "10 AM", value: Math.floor(Math.random() * 10) },
        { hour: "11 AM", value: Math.floor(Math.random() * 10) },
        { hour: "12 PM", value: Math.floor(Math.random() * 10) },
        { hour: "1 PM", value: Math.floor(Math.random() * 10) },
        { hour: "2 PM", value: Math.floor(Math.random() * 10) },
        { hour: "3 PM", value: Math.floor(Math.random() * 10) },
        { hour: "4 PM", value: Math.floor(Math.random() * 10) },
        { hour: "5 PM", value: Math.floor(Math.random() * 10) },
      ],
      current_hour: {
        value: Math.floor(Math.random() * 10),
        unit: "tons",
      },
      daily_average: {
        value: Math.floor(Math.random() * 10),
        unit: "tons/hr",
      },
      peak_hours: {
        range: `${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)} AM`,
      },
      efficiency: {
        percentage: Math.floor(Math.random() * 10),
      },
    };
  }

  async getBusyHours(siteId: string): Promise<MiningSitesBusyHoursResponseDto> {
    const labels = [
      "6AM",
      "7AM",
      "8AM",
      "9AM",
      "10AM",
      "11AM",
      "12PM",
      "1PM",
      "2PM",
      "3PM",
      "4PM",
      "5PM",
      "6PM",
      "7PM",
      "8PM",
    ];
    const truckEntries = labels.map(() => Math.floor(Math.random() * 15));
    const volumeExtractedTons = labels.map(() =>
      Math.floor(Math.random() * 100),
    );

    // Find peak values and their indices
    const maxTruckIndex = truckEntries.reduce(
      (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
      0,
    );
    const maxVolumeIndex = volumeExtractedTons.reduce(
      (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
      0,
    );

    const peaks = {
      truck_activity: {
        time: `${labels[maxTruckIndex].replace("AM", ":00 AM").replace("PM", ":00 PM")}`,
        count: truckEntries[maxTruckIndex],
        label: labels[maxTruckIndex],
      },
      extraction: {
        time: `${labels[maxVolumeIndex].replace("AM", ":00 AM").replace("PM", ":00 PM")}`,
        tons: volumeExtractedTons[maxVolumeIndex],
        label: labels[maxVolumeIndex],
      },
    };

    return {
      site_id: siteId,
      date: new Date().toISOString().slice(0, 10),
      range: "today",
      series: {
        labels: labels,
        truck_entries: truckEntries,
        volume_extracted_tons: volumeExtractedTons,
      },
      peaks: peaks,
      last_updated: new Date().toISOString(),
    };
  }

  async getLiveAiCameras(
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

  async getAiCamerasSummary(siteId: string): Promise<AiCamerasSummaryDto> {
    return {
      total_cameras: Math.floor(Math.random() * 10),
      operational: Math.floor(Math.random() * 10),
      maintenance: Math.floor(Math.random() * 10),
      offline: Math.floor(Math.random() * 10),
    };
  }

  async getMaterials(siteId: string): Promise<MiningSitesMaterialsResponseDto> {
    return {
      site_id: siteId,
      last_updated: new Date().toISOString(),
      materials: [
        {
          name: "Gold Ore",
          percentage: Math.floor(Math.random() * 10),
          price: Math.floor(Math.random() * 10).toString(),
          unit: "oz",
        },
        {
          name: "Silver Ore",
          percentage: Math.floor(Math.random() * 10),
          price: Math.floor(Math.random() * 10).toString(),
          unit: "oz",
        },
        {
          name: "Copper",
          percentage: Math.floor(Math.random() * 10),
          price: Math.floor(Math.random() * 10).toString(),
          unit: "lb",
        },
        {
          name: "Other Minerals",
          percentage: Math.floor(Math.random() * 10),
          price: Math.floor(Math.random() * 10).toString(),
          unit: "Various",
        },
      ],
    };
  }

  async getActivities(
    query: FindAllActivitiesDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};
    if (query.site_id) {
      filter.site_id = query.site_id;
    }

    const [entities, total] = await Promise.all([
      this.activitiesRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.activitiesRepository.countWithFilter(filter),
    ]);

    return { entities, total };
  }

  async getAlerts(
    siteId: string,
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

  async getAlertSummary(siteId: string): Promise<AlertSummaryDto> {
    const [breachAlertData, truckActivitiesData] = await Promise.all([
      this.alertsRepository.getBreachAlertSummary(siteId),
      this.alertsRepository.getTruckActivitiesSummary(siteId),
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
