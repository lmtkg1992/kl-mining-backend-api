import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { PermissionsController } from "./permissions.controller";
import { DocumentPermissionsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";
import { AdminUserGroupsModule } from "../admin-user-groups/admin-user-groups.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentPermissionsPersistenceModule,
    AdminUserGroupsModule,
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService, DocumentPermissionsPersistenceModule],
})
export class PermissionsModule {}
