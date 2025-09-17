import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReportsSchema, ReportsSchemaClass } from "./entities/reports.schema";
import { ReportsRepository } from "../reports.repository";
import { ReportsDocumentRepository } from "./repositories/reports.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportsSchemaClass.name, schema: ReportsSchema },
    ]),
  ],
  providers: [
    {
      provide: ReportsRepository,
      useClass: ReportsDocumentRepository,
    },
  ],
  exports: [ReportsRepository],
})
export class DocumentReportsPersistenceModule {}
