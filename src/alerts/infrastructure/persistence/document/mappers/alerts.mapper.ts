import { Alerts } from "../../../../domain/alerts";
import { AlertsSchemaClass } from "../entities/alerts.schema";

export class AlertsMapper {
  public static toDomain(raw: AlertsSchemaClass): Alerts {
    const domainEntity = new Alerts();
    domainEntity.id = raw._id.toString();
    domainEntity.type = raw.type;
    domainEntity.title = raw.title;
    domainEntity.description = raw.description;
    domainEntity.site_id = raw.site_id;
    domainEntity.severity = raw.severity;
    domainEntity.resolved = raw.resolved;
    domainEntity.truck_id = raw.truck_id;
    domainEntity.timestamp = raw.timestamp;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Alerts): AlertsSchemaClass {
    const persistenceSchema = new AlertsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.type = domainEntity.type;
    persistenceSchema.title = domainEntity.title;
    persistenceSchema.description = domainEntity.description;
    persistenceSchema.site_id = domainEntity.site_id;
    persistenceSchema.severity = domainEntity.severity;
    persistenceSchema.resolved = domainEntity.resolved;
    persistenceSchema.truck_id = domainEntity.truck_id;
    persistenceSchema.timestamp = domainEntity.timestamp;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
