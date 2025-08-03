import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  AdminUsersSchema,
  AdminUsersSchemaClass,
} from "./entities/admin-users.schema";
import { AdminUsersRepository } from "../admin-users.repository";
import { AdminUsersDocumentRepository } from "./repositories/admin-users.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminUsersSchemaClass.name, schema: AdminUsersSchema },
    ]),
  ],
  providers: [
    {
      provide: AdminUsersRepository,
      useClass: AdminUsersDocumentRepository,
    },
  ],
  exports: [AdminUsersRepository],
})
export class DocumentAdminUsersPersistenceModule {}
