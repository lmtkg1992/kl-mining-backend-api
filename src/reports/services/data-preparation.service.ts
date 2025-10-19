import { Injectable, Logger } from '@nestjs/common';
import { ReportType } from '../domain/reports';
import { AdminUsersService } from '../../admin-users/admin-users.service';
import { ProvincesService } from '../../provinces/provinces.service';
import { MiningSitesService } from '../../mining-sites/mining-sites.service';
import { AiCamerasService } from '../../ai-cameras/ai-cameras.service';
import { AiSnapshotsService } from '../../ai-snapshots/ai-snapshots.service';
import { AlertsService } from '../../alerts/alerts.service';
import { TrucksService } from '../../trucks/trucks.service';
import { TruckWeightBridgeRecordsService } from '../../truck-weight-bridge-records/truck-weight-bridge-records.service';
import { AiCameraStatusEnum } from '../../ai-cameras/ai-cameras.enum';

export interface DataPreparationOptions {
  reportType: ReportType;
  startDate: string;
  endDate: string;
  siteId?: string;
  provinceId?: string;
  generatedBy: string;
  reportName?: string;
  reportOptions?: any;
}

export interface PreparedReportData {
  reportType: ReportType;
  reportInfo: {
    title: string;
    reportName?: string;
    period: string;
    generatedBy: string;
    siteName?: string;
    provinceName?: string;
    generatedAt: string;
  };
  data: any;
  summary: any;
}

@Injectable()
export class DataPreparationService {
  private readonly logger = new Logger(DataPreparationService.name);

  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly provincesService: ProvincesService,
    private readonly miningSitesService: MiningSitesService,
    private readonly aiCamerasService: AiCamerasService,
    private readonly aiSnapshotsService: AiSnapshotsService,
    private readonly alertsService: AlertsService,
    private readonly trucksService: TrucksService,
    private readonly truckWeightBridgeRecordsService: TruckWeightBridgeRecordsService,
  ) {}

  async prepareReportData(options: DataPreparationOptions): Promise<PreparedReportData> {
    this.logger.log(`Preparing data for report type: ${options.reportType}`);

    // Get basic report information
    const reportInfo = await this.getReportInfo(options);

    // Prepare data based on report type
    let data: any;
    let summary: any;

    switch (options.reportType) {
      case ReportType.CAMERA_PERFORMANCE:
        ({ data, summary } = await this.prepareCameraPerformanceData(options));
        break;
      case ReportType.BREACH_SUMMARY:
        ({ data, summary } = await this.prepareBreachSummaryData(options));
        break;
      case ReportType.TRANSPORT_ACTIVITY:
        ({ data, summary } = await this.prepareTransportActivityData(options));
        break;
      case ReportType.VOLUME_TRACKING:
        ({ data, summary } = await this.prepareVolumeTrackingData(options));
        break;
      default:
        throw new Error(`Unsupported report type: ${options.reportType}`);
    }

    return {
      reportType: options.reportType,
      reportInfo,
      data,
      summary,
    };
  }

  private async getReportInfo(options: DataPreparationOptions) {
    const generatedByUser = await this.adminUsersService.findById(options.generatedBy);
    const site = options.siteId ? await this.miningSitesService.findById(options.siteId) : null;
    const province = options.provinceId ? await this.provincesService.findById(options.provinceId) : null;

    // Generate report name if not provided
    let reportName = options.reportName;
    if (!reportName && site) {
      reportName = `${site.site_name} Report`;
    } else if (!reportName) {
      reportName = `${this.getReportTitle(options.reportType)}`;
    }

    return {
      title: this.getReportTitle(options.reportType),
      reportName: reportName,
      period: `${options.startDate} to ${options.endDate}`,
      generatedBy: generatedByUser?.name || 'Unknown User',
      siteName: site?.site_name || 'All Sites',
      provinceName: province?.province_name || 'All Provinces',
      generatedAt: new Date().toLocaleString(),
    };
  }

  private getReportTitle(reportType: ReportType): string {
    switch (reportType) {
      case ReportType.CAMERA_PERFORMANCE:
        return 'Camera Performance Report';
      case ReportType.BREACH_SUMMARY:
        return 'Breach Summary Report';
      case ReportType.TRANSPORT_ACTIVITY:
        return 'Transport Activity Report';
      case ReportType.VOLUME_TRACKING:
        return 'Volume Tracking Report';
      default:
        return 'Mining Report';
    }
  }

  private async prepareCameraPerformanceData(options: DataPreparationOptions) {
    this.logger.log('Preparing camera performance data');

    // Build filter based on priority: site_id > province_id > all
    const filter = this.buildFilter(options);

    // Get cameras data with filter
    const cameras = await this.aiCamerasService.findAllWithFilterAndPagination(
      filter,
      { page: 1, limit: 1000 }
    );

    // Get snapshots data for performance metrics with same filter
    const snapshots = await this.aiSnapshotsService.findAllWithFilterAndPagination(
      filter,
      { page: 1, limit: 1000 }
    );

    // Filter snapshots by site/province if needed
    const filteredSnapshots = this.filterSnapshotsByLocation(snapshots.entities, options);
    
    // Calculate performance metrics
    const performanceMetrics = cameras.entities.map(camera => {
      const cameraSnapshots = filteredSnapshots.filter(snapshot => 
        snapshot.camera_id?.id === camera.id
      );

      const totalSnapshots = cameraSnapshots.length;
      const successfulDetections = cameraSnapshots.filter(s => s.event_type === 'truck' || s.event_type === 'breach').length;
      const accuracy = totalSnapshots > 0 ? (successfulDetections / totalSnapshots) * 100 : 0;

      return {
        cameraId: camera.id,
        cameraName: camera.code || `Camera ${camera.id}`,
        location: camera.location_description || 'Unknown',
        status: camera.status || AiCameraStatusEnum.online,
        uptime: 98.5, // This would be calculated from actual uptime data
        detectionAccuracy: Math.round(accuracy * 100) / 100,
        responseTime: 120, // This would be calculated from actual response times
        totalSnapshots,
        successfulDetections,
        lastActivity: cameraSnapshots.length > 0 
          ? cameraSnapshots[cameraSnapshots.length - 1].timestamp 
          : null,
      };
    });

    const summary = {
      totalCameras: cameras.entities.length,
      activeCameras: performanceMetrics.filter(m => m.status === AiCameraStatusEnum.online).length,
      averageUptime: performanceMetrics.length > 0 
        ? Math.round((performanceMetrics.reduce((sum, m) => sum + m.uptime, 0) / performanceMetrics.length) * 100) / 100
        : 0,
      averageAccuracy: performanceMetrics.length > 0 
        ? Math.round((performanceMetrics.reduce((sum, m) => sum + m.detectionAccuracy, 0) / performanceMetrics.length) * 100) / 100
        : 0,
      totalSnapshots: performanceMetrics.reduce((sum, m) => sum + m.totalSnapshots, 0),
      totalDetections: performanceMetrics.reduce((sum, m) => sum + m.successfulDetections, 0),
    };

    return {
      data: {
        performanceMetrics,
        cameras: cameras.entities,
        snapshots: filteredSnapshots,
      },
      summary,
    };
  }

  private async prepareBreachSummaryData(options: DataPreparationOptions) {
    this.logger.log('Preparing breach summary data');

    // Get alerts data for breach information
    const alerts = await this.alertsService.findAllWithPagination({
      paginationOptions: { page: 1, limit: 100000 }
    });

    // Filter alerts by date range, type, and location
    const breachAlerts = alerts.filter(alert => {
      const alertDate = new Date(alert.timestamp);
      const dateMatch = alertDate >= new Date(options.startDate) && 
                       alertDate <= new Date(options.endDate);
      const typeMatch = alert.alert_type === 'breach_event';

      const locationMatch = this.matchesLocationFilter(alert, options);

      return dateMatch && typeMatch && locationMatch;
    });

    // Get sites and provinces for location information
    const sites = await this.miningSitesService.findAllWithPagination({
      paginationOptions: { page: 1, limit: 1000 }
    });

    const provinces = await this.provincesService.findAllWithPagination({
      paginationOptions: { page: 1, limit: 1000 }
    });

    const breachDetails = breachAlerts.map(alert => {
      const site = sites.find(s => s.id === alert.site_id?.id);
      const province = provinces.find(p => p.id === alert.site_id?.province?.id);

      return {
        id: alert.id,
        date: alert.timestamp,
        time: new Date(alert.timestamp).toLocaleTimeString(),
        location: site?.site_name || 'Unknown Location',
        province: province?.province_name || 'Unknown Province',
        type: alert.breach_type || 'Security Breach',
        severity: this.determineSeverity(alert.severity || 'medium'),
        status: alert.status || 'new',
        description: alert.description || 'No description available',
        resolvedAt: alert.alerts_resolution?.acknowledged_at,
      };
    });

    const summary = {
      totalBreaches: breachDetails.length,
      highSeverity: breachDetails.filter(b => b.severity === 'High').length,
      mediumSeverity: breachDetails.filter(b => b.severity === 'Medium').length,
      lowSeverity: breachDetails.filter(b => b.severity === 'Low').length,
      resolved: breachDetails.filter(b => b.status === 'resolved').length,
      open: breachDetails.filter(b => b.status === 'new' || b.status === 'under_review').length,
    };

    return {
      data: {
        breachDetails,
        alerts: breachAlerts,
        sites: sites,
        provinces: provinces,
      },
      summary,
    };
  }

  private async prepareTransportActivityData(options: DataPreparationOptions) {
    this.logger.log('Preparing transport activity data');

    // Get alerts data for truck activity
    const alerts = await this.alertsService.findAllWithFilterAndPagination(
      {
        alert_type: 'truck_activity',
        from_date: options.startDate,
        to_date: options.endDate,
      },
      { page: 1, limit: 100000 }
    );

    // Filter alerts by date range, type, and location
    const truckActivityAlerts = alerts.entities.filter(alert => {
      const locationMatch = this.matchesLocationFilter(alert, options);
      return locationMatch;
    });

    // Get sites and provinces for location information
    const sites = await this.miningSitesService.findAllWithPagination({
      paginationOptions: { page: 1, limit: 1000 }
    });

    const provinces = await this.provincesService.findAllWithPagination({
      paginationOptions: { page: 1, limit: 1000 }
    });

    // Transform truck activity alerts into transport activity details
    const activityDetails = truckActivityAlerts.map(alert => {
      const site = sites.find(s => s.id === alert.site_id?.id);
      const province = provinces.find(p => p.id === alert.site_id?.province?.id);
      const loadWeight = MiningSitesService.VOLUME_PER_CAR * (alert.fill_level || 0) / 100;

      return {
        id: alert.id,
        date: alert.timestamp,
        truckId: alert.truck_id?.plate_number || 'Unknown Truck',
        driver: alert.truck_id?.driver_name || 'Unknown Driver', // Driver info not available in alerts
        loadWeight: loadWeight,
        status: alert.status || 'acknowledged',
        entryTime: alert.timestamp || alert.createdAt,
        exitTime: new Date(new Date(alert.createdAt).getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        site: site?.site_name || 'Unknown Site',
        province: province?.province_name || 'Unknown Province',
        direction: alert.direction || 'out',
        overloaded: alert.overloaded || false,
        truckType: alert.truck_type || 'dump_truck',
        evidenceUrl: alert.evidence_url || [],
      };
    });

    const summary = {
      totalActivities: activityDetails.length,
      totalWeight: activityDetails.reduce((sum, a) => sum + a.loadWeight, 0),
      completedTrips: activityDetails.filter(a => a.status === 'acknowledged' || a.status === 'resolved').length,
      activeTrips: activityDetails.filter(a => a.status === 'new' || a.status === 'under_review').length,
      uniqueTrucks: new Set(activityDetails.map(a => a.truckId)).size,
      averageWeight: activityDetails.length > 0 
        ? Math.round((activityDetails.reduce((sum, a) => sum + a.loadWeight, 0) / activityDetails.length) * 100) / 100
        : 0,
      overloadedTrips: activityDetails.filter(a => a.overloaded).length,
      inboundTrips: activityDetails.filter(a => a.direction === 'in').length,
      outboundTrips: activityDetails.filter(a => a.direction === 'out').length,
    };

    return {
      data: {
        activityDetails,
        alerts: truckActivityAlerts,
        sites: sites,
        provinces: provinces,
      },
      summary,
    };
  }

  private async prepareVolumeTrackingData(options: DataPreparationOptions) {
    this.logger.log('Preparing volume tracking data');

    // Get alerts data for truck activity with direction "out" (volume extraction)
    const alerts = await this.alertsService.findAllWithFilterAndPagination(
      {
        alert_type: 'truck_activity',
        from_date: options.startDate,
        to_date: options.endDate,
      },
      { page: 1, limit: 100000 }
    );

    // Get sites and provinces for location information
    const sites = await this.miningSitesService.findAllWithPagination({
      paginationOptions: { page: 1, limit: 1000 }
    });

    const provinces = await this.provincesService.findAllWithPagination({
      paginationOptions: { page: 1, limit: 1000 }
    });

    // Volume calculation constants (from MiningSitesService)
    const VOLUME_PER_CAR = 7; // tons per car capacity

    // Transform volume alerts into volume tracking details
    const volumeDetails = alerts.entities.map(alert => {
      const site = sites.find(s => s.id === alert.site_id?.id);
      const province = provinces.find(p => p.id === alert.site_id?.province?.id);
      
      // Calculate actual volume based on fill_level
      const fillLevel = alert.fill_level || 0;
      const actualVolume = VOLUME_PER_CAR * (fillLevel / 100);

      return {
        id: alert.id,
        date: alert.timestamp,
        site: site?.site_name || 'Unknown Site',
        province: province?.province_name || 'Unknown Province',
        volume: actualVolume,
        fillLevel: fillLevel,
        truckId: alert.truck_id?.plate_number || 'Unknown Truck',
        entryTime: alert.timestamp || alert.createdAt,
        exitTime: new Date(new Date(alert.timestamp).getTime() + 2 * 60 * 60 * 1000).toISOString(),
        truckType: alert.truck_type || 'dump_truck',
        overloaded: alert.overloaded || false,
        evidenceUrl: alert.evidence_url || [],
      };
    });

    // Group by site for summary
    const siteSummary = volumeDetails.reduce((acc, record) => {
      const key = record.site;
      if (!acc[key]) {
        acc[key] = {
          site: record.site,
          province: record.province,
          totalVolume: 0,
          trips: 0,
          averageVolume: 0,
          averageFillLevel: 0,
          overloadedTrips: 0,
        };
      }
      acc[key].totalVolume += record.volume;
      acc[key].trips += 1;
      acc[key].averageVolume = acc[key].totalVolume / acc[key].trips;
      acc[key].averageFillLevel = (acc[key].averageFillLevel * (acc[key].trips - 1) + record.fillLevel) / acc[key].trips;
      if (record.overloaded) {
        acc[key].overloadedTrips += 1;
      }
      return acc;
    }, {} as any);

    const summary = {
      totalVolume: volumeDetails.reduce((sum, v) => sum + v.volume, 0),
      totalTrips: volumeDetails.length,
      uniqueSites: new Set(volumeDetails.map(v => v.site)).size,
      averageVolumePerTrip: volumeDetails.length > 0 
        ? Math.round((volumeDetails.reduce((sum, v) => sum + v.volume, 0) / volumeDetails.length) * 100) / 100
        : 0,
      averageFillLevel: volumeDetails.length > 0 
        ? Math.round((volumeDetails.reduce((sum, v) => sum + v.fillLevel, 0) / volumeDetails.length) * 100) / 100
        : 0,
      overloadedTrips: volumeDetails.filter(v => v.overloaded).length,
      siteSummary: Object.values(siteSummary),
    };

    return {
      data: {
        volumeDetails,
        alerts: alerts.entities,
        sites: sites,
        provinces: provinces,
      },
      summary,
    };
  }

  private determineSeverity(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Medium';
    }
  }
  /**
   * Build filter object based on priority: site_id > province_id > all
   */
  private buildFilter(options: DataPreparationOptions): any {
    if (options.siteId) {
      return { site_id: options.siteId };
    }
    
    if (options.provinceId) {
      return { province_id: options.provinceId };
    }
    
    return {}; // No filter - get all data
  }

  /**
   * Filter snapshots by location based on priority: site_id > province_id > all
   */
  private filterSnapshotsByLocation(snapshots: any[], options: DataPreparationOptions): any[] {
    if (options.siteId) {
      return snapshots.filter(snapshot => 
        snapshot.camera_id?.site_id?.id === options.siteId
      );
    }
    
    if (options.provinceId) {
      return snapshots.filter(snapshot => 
        snapshot.camera_id?.site_id?.province?.id === options.provinceId
      );
    }
    
    return snapshots; // No filter - return all snapshots
  }

  /**
   * Filter trucks by location based on priority: site_id > province_id > all
   */
  private filterTrucksByLocation(trucks: any[], options: DataPreparationOptions): any[] {
    if (options.siteId) {
      return trucks.filter(truck => 
        truck.site_id?.some((site: any) => site.id === options.siteId)
      );
    }
    
    if (options.provinceId) {
      return trucks.filter(truck => 
        truck.site_id?.some((site: any) => site.province?.id === options.provinceId)
      );
    }
    
    return trucks; // No filter - return all trucks
  }

  /**
   * Check if alert matches location filter based on priority: site_id > province_id > all
   */
  private matchesLocationFilter(alert: any, options: DataPreparationOptions): boolean {
    if (options.siteId) {
      return alert.site_id?.id === options.siteId;
    }
    
    if (options.provinceId) {
      return alert.site_id?.province?.id === options.provinceId;
    }
    
    return true; // No filter - match all alerts
  }
}

