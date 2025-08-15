import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  AdminUserGroupsSchema,
  AdminUserGroupsSchemaClass,
} from "./entities/admin-user-groups.schema";
import { AdminUserGroupsRepository } from "../admin-user-groups.repository";
import { AdminUserGroupsDocumentRepository } from "./repositories/admin-user-groups.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminUserGroupsSchemaClass.name, schema: AdminUserGroupsSchema },
    ]),
  ],
  providers: [
    {
      provide: AdminUserGroupsRepository,
      useClass: AdminUserGroupsDocumentRepository,
    },
  ],
  exports: [AdminUserGroupsRepository],
})
export class DocumentAdminUserGroupsPersistenceModule {}
