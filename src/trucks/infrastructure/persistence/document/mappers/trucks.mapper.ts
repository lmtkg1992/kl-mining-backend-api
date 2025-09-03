import { Trucks } from "../../../../domain/trucks";
import { TrucksSchemaClass } from "../entities/trucks.schema";

export class TrucksMapper {
  public static toDomain(raw: TrucksSchemaClass): Trucks {
    const domainEntity = new Trucks();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Trucks): TrucksSchemaClass {
    const persistenceSchema = new TrucksSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
