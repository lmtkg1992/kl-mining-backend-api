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
import { FindAllAiSnapshotsDto } from "src/ai-snapshots/dto/find-all-ai-snapshots.dto";
import { AiSnapshotsService } from "src/ai-snapshots/ai-snapshots.service";

@Injectable()
export class MiningSitesService {

  public static readonly VOLUME_PER_CAR = 7;
  public static readonly QUOTA_MINING_SITE_PER_DAY = 210;

  constructor(
    // Dependencies here
    private readonly miningSitesRepository: MiningSitesRepository,
    private readonly aiCamerasRepository: AiCamerasRepository,
    private readonly activitiesRepository: ActivitiesRepository,
    private readonly alertsRepository: AlertsRepository,
    private readonly aiSnapshotsService: AiSnapshotsService,
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
      site_settings: createMiningSitesDto.site_settings,
      volume: 0,
      trucks: 0,
      breaches: 0,
      cameras_online: 0,
      last_activity: new Date(),
      last_updated_at: new Date(),
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

    const volumePerCar = MiningSitesService.VOLUME_PER_CAR;
    const fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date();
    toDate.setHours(23, 59, 59, 999);

    for (const entity of entites) {
      const totalBreachAlerts = await this.alertsRepository.countWithFilter({
        alert_type: "breach_event",
        site_id: entity.id,
        from_date: fromDate,
        to_date: toDate,
      });
      const totalTruckActivities = await this.alertsRepository.countWithFilter({
        alert_type: "truck_activity",
        site_id: entity.id,
        from_date: fromDate,
        to_date: toDate,
      });
      const camerasOnline = await this.aiCamerasRepository.countWithFilter({
        site_id: entity.id
      });
      entity.trucks = totalTruckActivities;
      entity.breaches = totalBreachAlerts;
      entity.cameras_online = camerasOnline;

      const volumeTruckOut = await this.alertsRepository.findAllWithFilterAndPagination({
        filter: {
          site_id: entity.id,
          alert_type: "truck_activity",
          direction: "out",
          from_date: fromDate,
          to_date: toDate,
        },
        paginationOptions: {
          page: 1,
          limit: 10000,
        },
      });
      const totalVolumeTruckOut = Math.floor(volumeTruckOut.reduce((acc, curr) => acc + volumePerCar * (curr.fill_level ? curr.fill_level/100 : 0), 0));
      entity.volume = totalVolumeTruckOut;
      entity.last_activity = new Date();
    }
    return { entites: entites, total };
  }

  async findById(id: MiningSites["id"]) {
    const site = await this.miningSitesRepository.findById(id);
    if (!site) {
      throw new NotFoundException("Site not found");
    }
    const totalBreachAlerts = await this.alertsRepository.countWithFilter({
      alert_type: "breach_event",
      site_id: site.id,
    });
    const totalTruckActivities = await this.alertsRepository.countWithFilter({
      alert_type: "truck_activity",
      site_id: site.id,
    });
    const camerasOnline = await this.aiCamerasRepository.countWithFilter({
      site_id: site.id,
    });
    const volumePerCar = MiningSitesService.VOLUME_PER_CAR;
    const fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date();
    toDate.setHours(23, 59, 59, 999);
    const volumeTruckOut = await this.alertsRepository.findAllWithFilterAndPagination({
      filter: {
        site_id: site.id,
        alert_type: "truck_activity",
        direction: "out",
        from_date: fromDate,
        to_date: toDate,
      },
      paginationOptions: {
        page: 1,
        limit: 10000,
      },
    });
    const totalVolumeTruckOut = Math.floor(volumeTruckOut.reduce((acc, curr) => acc + volumePerCar * (curr.fill_level ? curr.fill_level/100 : 0), 0));
    site.volume = totalVolumeTruckOut;
    site.last_activity = new Date();
    return {
      ...site,
      volume: totalVolumeTruckOut,
      trucks: totalTruckActivities,
      breaches: totalBreachAlerts,
      cameras_online: camerasOnline,
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
      site_name: updateMiningSitesDto.site_name,
      site_code: updateMiningSitesDto.site_code,
      status: updateMiningSitesDto.status,
      owner_user_id: {
        id: updateMiningSitesDto.owner_user_id,
      } as AdminUsers,
      province: {
        id: updateMiningSitesDto.province,
      } as Provinces,
      boundary_polygon: updateMiningSitesDto.boundary_polygon,
      material_type: updateMiningSitesDto.material_type,
      site_settings: updateMiningSitesDto.site_settings,
      last_updated_at: new Date(),
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

    const activeCameras = await this.aiCamerasRepository.countWithFilter({
      site_id: siteId,
      status: "online",
    }); 
    const totalCameras = await this.aiCamerasRepository.countWithFilter({
      site_id: siteId,
    });
    const needingMaintenanceCameras = await this.aiCamerasRepository.countWithFilter({
      site_id: siteId,
      status: "maintenance",
    });
    const offlineCameras = await this.aiCamerasRepository.countWithFilter({
      site_id: siteId,
      status: "offline",
    });
    const statusCamerasText = `${activeCameras}/${totalCameras} active — ${needingMaintenanceCameras} need maintenance`;

    const currentDate = new Date(dateFilter);
    const nextDate = new Date(dateFilter);
    nextDate.setDate(nextDate.getDate() + 1);
    const previousDate = new Date(dateFilter);
    previousDate.setDate(previousDate.getDate() - 1);

    const breachAlerts = await this.alertsRepository.countWithFilter({
      site_id: siteId,
      alert_type: "breach_event",
      from_date: currentDate,
      to_date: nextDate,
    });
    const yesterdayBreachAlerts = await this.alertsRepository.countWithFilter({
      site_id: siteId,
      alert_type: "breach_event",
      from_date: previousDate,
      to_date: currentDate,
    });
    let changeBreachAlerts = 0;
    if(yesterdayBreachAlerts > 0){
      changeBreachAlerts = (breachAlerts - yesterdayBreachAlerts) / yesterdayBreachAlerts * 100;
    }

    const truckActivities = await this.alertsRepository.countWithFilter({
      site_id: siteId,
      alert_type: "truck_activity",
      from_date: currentDate,
      to_date: nextDate,
    });

    const yesterdayTruckActivities = await this.alertsRepository.countWithFilter({
      site_id: siteId,
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
        site_id: siteId,
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

  async getTransport(siteId: string): Promise<MiningSitesTransportResponseDto> {

    const toDate = new Date();
    toDate.setHours(toDate.getHours() + 7);
    
    
    const fromDate = new Date();
    fromDate.setTime(toDate.getTime() - (24 * 60 * 60 * 1000));
      
    const hourlyVolumes = new Map<number, number>();
    // Initialize hourly volumes from fromDate to toDate
    let currentDate = new Date(fromDate.getTime() - 6 * 60 * 60 * 1000);
    const endDate = new Date(toDate.getTime() - 7 * 60 * 60 * 1000);    
    while (currentDate <= endDate) {
      const hour = currentDate.getHours();
      hourlyVolumes.set(hour, 0);
      currentDate.setHours(currentDate.getHours() + 1);
    }

    let volumeTruckOut = await this.alertsRepository.findAllWithFilterAndPagination({
      filter: {
        site_id: siteId,
        alert_type: "truck_activity",
        direction: "out",
        from_date: fromDate,
        to_date: toDate,
      },
      paginationOptions: {
        page: 1,
        limit: 10000,
      },
    });
    volumeTruckOut = volumeTruckOut.reverse();


    const volumePerCar = MiningSitesService.VOLUME_PER_CAR;

    for( const alert of volumeTruckOut){
      const timestamp = new Date(alert.timestamp.getTime() - 7 * 60 * 60 * 1000);
      const hour = timestamp.getHours();
      if (!hourlyVolumes.has(hour)) {
        hourlyVolumes.set(hour, 0);
      }
      const fillLevel = alert.fill_level || 0;
      const volume = volumePerCar * (fillLevel / 100);
      hourlyVolumes.set(hour, Math.floor(hourlyVolumes.get(hour)! + volume));
    }
    const hourlyData = Array.from(hourlyVolumes.entries()).map(([hour, volume]) => ({
      hour: `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`,
      value: volume,
    }));
    // console.log("Hourly volumes:", Object.fromEntries(hourlyVolumes));

    // Get max value and its hour from hourly data
    const maxHourData = hourlyData.reduce((max, current) => 
      current.value > max.value ? current : max
    , hourlyData[0]);

    return {
      site_id: siteId,
      last_updated: new Date().toISOString(),
      hourly_data: hourlyData,
      current_hour: {
        value: hourlyData[hourlyData.length - 1].value,
        unit: "tons",
      },
      daily_average: {
        value: Math.floor(hourlyData.reduce((acc, curr) => acc + curr.value, 0) / hourlyData.length),
        unit: "tons/hr",
      },
      peak_hours: {
        range: maxHourData.hour,
      },
      efficiency: {
        percentage: 100,
      },
    };
  }

  async getBusyHours(siteId: string): Promise<MiningSitesBusyHoursResponseDto> {

    const toDate = new Date();
    toDate.setHours(23, 59, 59, 999);
    toDate.setHours(toDate.getHours() + 7);

    const fromDate = new Date();
    fromDate.setTime(toDate.getTime() - (24 * 60 * 60 * 1000));

    let volumeTruckOut = await this.alertsRepository.findAllWithFilterAndPagination({
      filter: {
        site_id: siteId,
        alert_type: "truck_activity",
        direction: "out",
        from_date: fromDate,
        to_date: toDate,
      },
      paginationOptions: {
        page: 1,
        limit: 10000,
      },
    });
    volumeTruckOut = volumeTruckOut.reverse();

    const volumePerCar = MiningSitesService.VOLUME_PER_CAR;

    const labelHours: string[] = [];
    const truckActivities = new Map<number, number>();
    const extractedTons = new Map<number, number>();

    for( const alert of volumeTruckOut){
      const timestamp = new Date(alert.timestamp.getTime() - 7 * 60 * 60 * 1000);
      const hour = timestamp.getHours();
      const labelHour = `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;
      if (!labelHours.includes(labelHour)) {
        labelHours.push(labelHour);
      }
      if (!truckActivities.has(hour)) {
        truckActivities.set(hour, 0);
      }
      if (!extractedTons.has(hour)) {
        extractedTons.set(hour, 0);
      }
      const fillLevel = alert.fill_level || 0;
      const volume = volumePerCar * (fillLevel / 100);
      truckActivities.set(hour, Math.floor(truckActivities.get(hour)! + 1));
      extractedTons.set(hour, Math.floor(extractedTons.get(hour)! + volume));
    }

    const truckEntries = Array.from(truckActivities.values());
    const volumeExtractedTons = Array.from(extractedTons.values());

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
        time: `${labelHours[maxTruckIndex]}`,
        count: truckEntries[maxTruckIndex],
        label: labelHours[maxTruckIndex],
      },
      extraction: {
        time: `${labelHours[maxVolumeIndex]}`,
        tons: volumeExtractedTons[maxVolumeIndex],
        label: labelHours[maxVolumeIndex],
      },
    };

    return {
      site_id: siteId,
      date: new Date().toISOString().slice(0, 10),
      range: "today",
      series: {
        labels: labelHours,
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
    const totalCameras = await this.aiCamerasRepository.countWithFilter({
      site_id: siteId,
    });
    const operationalCameras = await this.aiCamerasRepository.countWithFilter({
      site_id: siteId,
      status: "online",
    });
    const maintenanceCameras = await this.aiCamerasRepository.countWithFilter({
      site_id: siteId,
      status: "maintenance",
    });
    const offlineCameras = await this.aiCamerasRepository.countWithFilter({
      site_id: siteId,
      status: "offline",
    });
    return {
      total_cameras: totalCameras,
      operational: operationalCameras,
      maintenance: maintenanceCameras,
      offline: offlineCameras,
    };
  }

  async getMaterials(siteId: string): Promise<MiningSitesMaterialsResponseDto> {
    return {
      site_id: siteId,
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
      this.alertsRepository.getBreachAlertSummary("site", [siteId]),
      this.alertsRepository.getTruckActivitiesSummary("site", [siteId]),
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

  async getAiSnapshot(query: FindAllAiSnapshotsDto, paginationOptions: IPaginationOptions) {
    const aiSnapshots = await this.aiSnapshotsService.findAllWithFilterAndPagination(query, paginationOptions);
    return aiSnapshots;
  }
}
