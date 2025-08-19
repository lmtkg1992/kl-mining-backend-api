import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { AdminUserGroupsService } from "./admin-user-groups.service";
import { AdminUserGroupsController } from "./admin-user-groups.controller";
import { DocumentAdminUserGroupsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";
import { PermissionsModule } from "src/permissions/permissions.module";
import { AdminUsersModule } from "src/admin-users/admin-users.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentAdminUserGroupsPersistenceModule,
    forwardRef(() => PermissionsModule),
    forwardRef(() => AdminUsersModule),
  ],
  controllers: [AdminUserGroupsController],
  providers: [AdminUserGroupsService],
  exports: [AdminUserGroupsService, DocumentAdminUserGroupsPersistenceModule],
})
export class AdminUserGroupsModule {}
