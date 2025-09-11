import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { ProvincesService } from "./provinces.service";
import { ProvincesController } from "./provinces.controller";
import { DocumentProvincesPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { AdminUsersModule } from "../admin-users/admin-users.module";
import { MiningSitesModule } from "../mining-sites/mining-sites.module";
import { AiCamerasModule } from "../ai-cameras/ai-cameras.module";
import { AlertsModule } from "../alerts/alerts.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentProvincesPersistenceModule,
    PermissionsModule,
    forwardRef(() => AdminUsersModule),
    forwardRef(() => MiningSitesModule),
    forwardRef(() => AiCamerasModule),
    forwardRef(() => AlertsModule),
  ],
  controllers: [ProvincesController],
  providers: [ProvincesService],
  exports: [ProvincesService, DocumentProvincesPersistenceModule],
})
export class ProvincesModule {}
