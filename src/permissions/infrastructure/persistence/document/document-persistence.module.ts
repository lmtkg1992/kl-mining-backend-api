import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  PermissionsSchema,
  PermissionsSchemaClass,
} from "./entities/permissions.schema";
import { PermissionsRepository } from "../permissions.repository";
import { PermissionsDocumentRepository } from "./repositories/permissions.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PermissionsSchemaClass.name, schema: PermissionsSchema },
    ]),
  ],
  providers: [
    {
      provide: PermissionsRepository,
      useClass: PermissionsDocumentRepository,
    },
  ],
  exports: [PermissionsRepository],
})
export class DocumentPermissionsPersistenceModule {}
