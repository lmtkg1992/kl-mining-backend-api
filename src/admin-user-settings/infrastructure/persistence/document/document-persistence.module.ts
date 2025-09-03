import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  AdminUserSettingsSchema,
  AdminUserSettingsSchemaClass,
} from "./entities/admin-user-settings.schema";
import { AdminUserSettingsRepository } from "../admin-user-settings.repository";
import { AdminUserSettingsDocumentRepository } from "./repositories/admin-user-settings.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AdminUserSettingsSchemaClass.name,
        schema: AdminUserSettingsSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: AdminUserSettingsRepository,
      useClass: AdminUserSettingsDocumentRepository,
    },
  ],
  exports: [AdminUserSettingsRepository],
})
export class DocumentAdminUserSettingsPersistenceModule {}
