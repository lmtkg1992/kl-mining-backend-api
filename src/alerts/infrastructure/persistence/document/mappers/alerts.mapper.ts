import { Alerts } from "../../../../domain/alerts";

import { ActivitiesMapper } from "../../../../../activities/infrastructure/persistence/document/mappers/activities.mapper";

import { AiCamerasMapper } from "../../../../../ai-cameras/infrastructure/persistence/document/mappers/ai-cameras.mapper";

import { TrucksMapper } from "../../../../../trucks/infrastructure/persistence/document/mappers/trucks.mapper";

import { MiningSitesMapper } from "../../../../../mining-sites/infrastructure/persistence/document/mappers/mining-sites.mapper";

import { AlertsSchemaClass } from "../entities/alerts.schema";

export class AlertsMapper {
  public static toDomain(raw: AlertsSchemaClass): Alerts {
    const domainEntity = new Alerts();
    domainEntity.evidence_url = raw.evidence_url;

    domainEntity.breach_type = raw.breach_type;

    domainEntity.direction = raw.direction;

    domainEntity.overloaded = raw.overloaded;

    domainEntity.fill_level = raw.fill_level;

    domainEntity.confidence = raw.confidence;

    domainEntity.status = raw.status;

    domainEntity.severity = raw.severity;

    if (raw.event_id) {
      domainEntity.event_id = ActivitiesMapper.toDomain(raw.event_id);
    } else if (raw.event_id === null) {
      domainEntity.event_id = null;
    }

    if (raw.camera_id) {
      domainEntity.camera_id = AiCamerasMapper.toDomain(raw.camera_id);
    } else if (raw.camera_id === null) {
      domainEntity.camera_id = null;
    }

    if (raw.truck_id) {
      domainEntity.truck_id = TrucksMapper.toDomain(raw.truck_id);
    } else if (raw.truck_id === null) {
      domainEntity.truck_id = null;
    }

    if (raw.site_id) {
      domainEntity.site_id = MiningSitesMapper.toDomain(raw.site_id);
    }

    domainEntity.truck_type = raw.truck_type;

    domainEntity.timestamp = raw.timestamp;

    domainEntity.description = raw.description;

    domainEntity.title = raw.title;

    domainEntity.alert_type = raw.alert_type;

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Alerts): AlertsSchemaClass {
    const persistenceSchema = new AlertsSchemaClass();
    persistenceSchema.evidence_url = domainEntity.evidence_url;

    persistenceSchema.breach_type = domainEntity.breach_type;

    persistenceSchema.direction = domainEntity.direction;

    persistenceSchema.overloaded = domainEntity.overloaded;

    persistenceSchema.fill_level = domainEntity.fill_level;

    persistenceSchema.confidence = domainEntity.confidence;

    persistenceSchema.status = domainEntity.status;

    persistenceSchema.severity = domainEntity.severity;

    if (domainEntity.event_id) {
      persistenceSchema.event_id = ActivitiesMapper.toPersistence(
        domainEntity.event_id,
      );
    } else if (domainEntity.event_id === null) {
      persistenceSchema.event_id = null;
    }

    if (domainEntity.camera_id) {
      persistenceSchema.camera_id = AiCamerasMapper.toPersistence(
        domainEntity.camera_id,
      );
    } else if (domainEntity.camera_id === null) {
      persistenceSchema.camera_id = null;
    }

    if (domainEntity.truck_id) {
      persistenceSchema.truck_id = TrucksMapper.toPersistence(
        domainEntity.truck_id,
      );
    } else if (domainEntity.truck_id === null) {
      persistenceSchema.truck_id = null;
    }

    if (domainEntity.site_id) {
      persistenceSchema.site_id = MiningSitesMapper.toPersistence(
        domainEntity.site_id,
      );
    }

    persistenceSchema.truck_type = domainEntity.truck_type;

    persistenceSchema.timestamp = domainEntity.timestamp;

    persistenceSchema.description = domainEntity.description;

    persistenceSchema.title = domainEntity.title;

    persistenceSchema.alert_type = domainEntity.alert_type;

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
