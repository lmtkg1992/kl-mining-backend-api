import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { MiningSitesService } from "./mining-sites.service";
import { MiningSitesController } from "./mining-sites.controller";
import { DocumentMiningSitesPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { AdminUsersModule } from "../admin-users/admin-users.module";
import { AiCamerasModule } from "src/ai-cameras/ai-cameras.module";
import { ActivitiesModule } from "../activities/activities.module";
import { AlertsModule } from "../alerts/alerts.module";
import { AiSnapshotsModule } from "src/ai-snapshots/ai-snapshots.module";
import { ReportsModule } from "src/reports/reports.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentMiningSitesPersistenceModule,
    PermissionsModule,
    forwardRef(() => AdminUsersModule),
    forwardRef(() => ActivitiesModule),
    forwardRef(() => AlertsModule),
    forwardRef(() => AiSnapshotsModule),
    forwardRef(() => ReportsModule),
    forwardRef(() => AiCamerasModule),
  ],
  controllers: [MiningSitesController],
  providers: [MiningSitesService],
  exports: [MiningSitesService, DocumentMiningSitesPersistenceModule],
})
export class MiningSitesModule {}
