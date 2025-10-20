import { AdminUsersModule } from "../admin-users/admin-users.module";
import { ProvincesModule } from "../provinces/provinces.module";
import { MiningSitesModule } from "../mining-sites/mining-sites.module";
import { AiCamerasModule } from "../ai-cameras/ai-cameras.module";
import { AiSnapshotsModule } from "../ai-snapshots/ai-snapshots.module";
import { AlertsModule } from "../alerts/alerts.module";
import { TrucksModule } from "../trucks/trucks.module";
import { TruckWeightBridgeRecordsModule } from "../truck-weight-bridge-records/truck-weight-bridge-records.module";
import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { ConfigModule } from "@nestjs/config";
import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";
import { DocumentReportsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";
import { PdfGenerationService } from "./services/pdf-generation.service";
import { ExcelGenerationService } from "./services/excel-generation.service";
import { ExportService } from "./services/export.service";
import { FileStorageService } from "./services/file-storage.service";
import { ReportQueueService } from "./services/report-queue.service";
import { ReportQueueProcessor } from "./processors/report-queue.processor";
import { DataPreparationService } from "./services/data-preparation.service";
import {
  CameraPerformanceTemplateService,
  BreachSummaryTemplateService,
  TransportActivityTemplateService,
  VolumeTrackingTemplateService,
  TemplateServiceFactory,
} from "./services/template-services";

@Module({
  imports: [
    // do not remove this comment
    DocumentReportsPersistenceModule,
    ConfigModule,
    BullModule.registerQueue({
      name: "report-generation",
    }),
    forwardRef(() => AdminUsersModule),
    forwardRef(() => ProvincesModule),
    forwardRef(() => MiningSitesModule),
    forwardRef(() => AiCamerasModule),
    forwardRef(() => AiSnapshotsModule),
    forwardRef(() => AlertsModule),
    forwardRef(() => TrucksModule),
    forwardRef(() => TruckWeightBridgeRecordsModule),
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    PdfGenerationService,
    ExcelGenerationService,
    ExportService,
    FileStorageService,
    ReportQueueService,
    ReportQueueProcessor,
    DataPreparationService,
    CameraPerformanceTemplateService,
    BreachSummaryTemplateService,
    TransportActivityTemplateService,
    VolumeTrackingTemplateService,
    TemplateServiceFactory,
  ],
  exports: [
    ReportsService,
    DocumentReportsPersistenceModule,
    ReportQueueService,
    PdfGenerationService,
    ExcelGenerationService,
    ExportService,
    FileStorageService,
    DataPreparationService,
  ],
})
export class ReportsModule {}
