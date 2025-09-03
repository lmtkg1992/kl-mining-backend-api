import { TruckWeightBridgeRecords } from "../../../../domain/truck-weight-bridge-records";
import { TruckWeightBridgeRecordsSchemaClass } from "../entities/truck-weight-bridge-records.schema";

export class TruckWeightBridgeRecordsMapper {
  public static toDomain(
    raw: TruckWeightBridgeRecordsSchemaClass,
  ): TruckWeightBridgeRecords {
    const domainEntity = new TruckWeightBridgeRecords();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: TruckWeightBridgeRecords,
  ): TruckWeightBridgeRecordsSchemaClass {
    const persistenceSchema = new TruckWeightBridgeRecordsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
