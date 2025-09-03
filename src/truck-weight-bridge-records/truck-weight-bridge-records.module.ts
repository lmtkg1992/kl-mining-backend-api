import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { TruckWeightBridgeRecordsService } from "./truck-weight-bridge-records.service";
import { TruckWeightBridgeRecordsController } from "./truck-weight-bridge-records.controller";
import { DocumentTruckWeightBridgeRecordsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentTruckWeightBridgeRecordsPersistenceModule,
  ],
  controllers: [TruckWeightBridgeRecordsController],
  providers: [TruckWeightBridgeRecordsService],
  exports: [
    TruckWeightBridgeRecordsService,
    DocumentTruckWeightBridgeRecordsPersistenceModule,
  ],
})
export class TruckWeightBridgeRecordsModule {}
