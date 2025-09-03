import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  TruckWeightBridgeRecordsSchema,
  TruckWeightBridgeRecordsSchemaClass,
} from "./entities/truck-weight-bridge-records.schema";
import { TruckWeightBridgeRecordsRepository } from "../truck-weight-bridge-records.repository";
import { TruckWeightBridgeRecordsDocumentRepository } from "./repositories/truck-weight-bridge-records.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TruckWeightBridgeRecordsSchemaClass.name,
        schema: TruckWeightBridgeRecordsSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: TruckWeightBridgeRecordsRepository,
      useClass: TruckWeightBridgeRecordsDocumentRepository,
    },
  ],
  exports: [TruckWeightBridgeRecordsRepository],
})
export class DocumentTruckWeightBridgeRecordsPersistenceModule {}
