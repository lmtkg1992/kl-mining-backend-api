import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  ProvincesSchema,
  ProvincesSchemaClass,
} from "./entities/provinces.schema";
import { ProvincesRepository } from "../provinces.repository";
import { ProvincesDocumentRepository } from "./repositories/provinces.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProvincesSchemaClass.name, schema: ProvincesSchema },
    ]),
  ],
  providers: [
    {
      provide: ProvincesRepository,
      useClass: ProvincesDocumentRepository,
    },
  ],
  exports: [ProvincesRepository],
})
export class DocumentProvincesPersistenceModule {}
