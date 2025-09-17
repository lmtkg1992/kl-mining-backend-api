import { AdminUsersModule } from "../admin-users/admin-users.module";
import { ProvincesModule } from "../provinces/provinces.module";
import { MiningSitesModule } from "../mining-sites/mining-sites.module";
import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";
import { DocumentReportsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentReportsPersistenceModule,
    forwardRef(() => AdminUsersModule),
    forwardRef(() => ProvincesModule),
    forwardRef(() => MiningSitesModule),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService, DocumentReportsPersistenceModule],
})
export class ReportsModule {}
