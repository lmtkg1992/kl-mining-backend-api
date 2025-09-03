import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { AdminUserSettingsService } from "./admin-user-settings.service";
import { AdminUserSettingsController } from "./admin-user-settings.controller";
import { DocumentAdminUserSettingsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentAdminUserSettingsPersistenceModule,
  ],
  controllers: [AdminUserSettingsController],
  providers: [AdminUserSettingsService],
  exports: [
    AdminUserSettingsService,
    DocumentAdminUserSettingsPersistenceModule,
  ],
})
export class AdminUserSettingsModule {}
