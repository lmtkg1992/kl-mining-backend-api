import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  PersonnelSchema,
  PersonnelSchemaClass,
} from "./entities/personnel.schema";
import { PersonnelRepository } from "../personnel.repository";
import { PersonnelDocumentRepository } from "./repositories/personnel.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PersonnelSchemaClass.name, schema: PersonnelSchema },
    ]),
  ],
  providers: [
    {
      provide: PersonnelRepository,
      useClass: PersonnelDocumentRepository,
    },
  ],
  exports: [PersonnelRepository],
})
export class DocumentPersonnelPersistenceModule {}
