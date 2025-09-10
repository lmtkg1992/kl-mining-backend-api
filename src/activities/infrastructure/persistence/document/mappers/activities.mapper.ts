import { Activities } from "../../../../domain/activities";

import { TrucksMapper } from "../../../../../trucks/infrastructure/persistence/document/mappers/trucks.mapper";

import { AiCamerasMapper } from "../../../../../ai-cameras/infrastructure/persistence/document/mappers/ai-cameras.mapper";

import { MiningSitesMapper } from "../../../../../mining-sites/infrastructure/persistence/document/mappers/mining-sites.mapper";

import { ActivitiesSchemaClass } from "../entities/activities.schema";

export class ActivitiesMapper {
  public static toDomain(raw: ActivitiesSchemaClass): Activities {
    const domainEntity = new Activities();
    domainEntity.volume = raw.volume;

    if (raw.truck_id) {
      domainEntity.truck_id = TrucksMapper.toDomain(raw.truck_id);
    } else if (raw.truck_id === null) {
      domainEntity.truck_id = null;
    }

    if (raw.camera_id) {
      domainEntity.camera_id = AiCamerasMapper.toDomain(raw.camera_id);
    } else if (raw.camera_id === null) {
      domainEntity.camera_id = null;
    }

    if (raw.site_id) {
      domainEntity.site_id = MiningSitesMapper.toDomain(raw.site_id);
    }
    domainEntity.status = raw.status;
    domainEntity.priority = raw.priority;
    domainEntity.event_type = raw.event_type;

    domainEntity.message = raw.message;
    domainEntity.title = raw.title;

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Activities): ActivitiesSchemaClass {
    const persistenceSchema = new ActivitiesSchemaClass();
    persistenceSchema.volume = domainEntity.volume;

    if (domainEntity.truck_id) {
      persistenceSchema.truck_id = TrucksMapper.toPersistence(
        domainEntity.truck_id,
      );
    } else if (domainEntity.truck_id === null) {
      persistenceSchema.truck_id = null;
    }

    if (domainEntity.camera_id) {
      persistenceSchema.camera_id = AiCamerasMapper.toPersistence(
        domainEntity.camera_id,
      );
    } else if (domainEntity.camera_id === null) {
      persistenceSchema.camera_id = null;
    }

    if (domainEntity.site_id) {
      persistenceSchema.site_id = MiningSitesMapper.toPersistence(
        domainEntity.site_id,
      );
    }
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.priority = domainEntity.priority;
    persistenceSchema.event_type = domainEntity.event_type;

    persistenceSchema.message = domainEntity.message;
    persistenceSchema.title = domainEntity.title;

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
