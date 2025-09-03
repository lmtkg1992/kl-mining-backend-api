import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AlertsSchema, AlertsSchemaClass } from "./entities/alerts.schema";
import { AlertsRepository } from "../alerts.repository";
import { AlertsDocumentRepository } from "./repositories/alerts.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AlertsSchemaClass.name, schema: AlertsSchema },
    ]),
  ],
  providers: [
    {
      provide: AlertsRepository,
      useClass: AlertsDocumentRepository,
    },
  ],
  exports: [AlertsRepository],
})
export class DocumentAlertsPersistenceModule {}
