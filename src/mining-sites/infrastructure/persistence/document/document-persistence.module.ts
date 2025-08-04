import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  MiningSitesSchema,
  MiningSitesSchemaClass,
} from "./entities/mining-sites.schema";
import { MiningSitesRepository } from "../mining-sites.repository";
import { MiningSitesDocumentRepository } from "./repositories/mining-sites.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MiningSitesSchemaClass.name, schema: MiningSitesSchema },
    ]),
  ],
  providers: [
    {
      provide: MiningSitesRepository,
      useClass: MiningSitesDocumentRepository,
    },
  ],
  exports: [MiningSitesRepository],
})
export class DocumentMiningSitesPersistenceModule {}
