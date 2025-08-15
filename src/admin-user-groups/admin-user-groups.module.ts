import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { AdminUserGroupsService } from "./admin-user-groups.service";
import { AdminUserGroupsController } from "./admin-user-groups.controller";
import { DocumentAdminUserGroupsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentAdminUserGroupsPersistenceModule,
  ],
  controllers: [AdminUserGroupsController],
  providers: [AdminUserGroupsService],
  exports: [AdminUserGroupsService, DocumentAdminUserGroupsPersistenceModule],
})
export class AdminUserGroupsModule {}
