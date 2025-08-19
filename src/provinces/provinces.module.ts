import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { ProvincesService } from "./provinces.service";
import { ProvincesController } from "./provinces.controller";
import { DocumentProvincesPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { AdminUsersModule } from "../admin-users/admin-users.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentProvincesPersistenceModule,
    PermissionsModule,
    AdminUsersModule,
  ],
  controllers: [ProvincesController],
  providers: [ProvincesService],
  exports: [ProvincesService, DocumentProvincesPersistenceModule],
})
export class ProvincesModule {}
