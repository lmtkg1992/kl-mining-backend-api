import { Trucks } from "../../../../domain/trucks";

import { MiningSitesMapper } from "../../../../../mining-sites/infrastructure/persistence/document/mappers/mining-sites.mapper";

import { TrucksSchemaClass } from "../entities/trucks.schema";

export class TrucksMapper {
  public static toDomain(raw: TrucksSchemaClass): Trucks {
    const domainEntity = new Trucks();
    domainEntity.last_activity_at = raw.last_activity_at;
    domainEntity.volume_recorded = raw.volume_recorded;
    domainEntity.type = raw.type;

    if (raw.site_id) {
      domainEntity.site_id = raw.site_id.map((item) =>
        MiningSitesMapper.toDomain(item),
      );
    }

    domainEntity.driver_name = raw.driver_name;
    domainEntity.plate_number = raw.plate_number;
    domainEntity.status = raw.status;

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Trucks): TrucksSchemaClass {
    const persistenceSchema = new TrucksSchemaClass();
    persistenceSchema.last_activity_at = domainEntity.last_activity_at;
    persistenceSchema.volume_recorded = domainEntity.volume_recorded;
    persistenceSchema.type = domainEntity.type;

    if (domainEntity.site_id) {
      persistenceSchema.site_id = domainEntity.site_id.map((item) =>
        MiningSitesMapper.toPersistence(item),
      );
    }

    persistenceSchema.driver_name = domainEntity.driver_name;
    persistenceSchema.plate_number = domainEntity.plate_number;
    persistenceSchema.status = domainEntity.status;

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
