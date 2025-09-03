import { Notifications } from "../../../../domain/notifications";
import { NotificationsSchemaClass } from "../entities/notifications.schema";

export class NotificationsMapper {
  public static toDomain(raw: NotificationsSchemaClass): Notifications {
    const domainEntity = new Notifications();
    domainEntity.id = raw._id.toString();
    domainEntity.event_type = raw.event_type;
    domainEntity.event_id = raw.event_id;
    domainEntity.event_link = raw.event_link;
    domainEntity.type = raw.type;
    domainEntity.title = raw.title;
    domainEntity.message = raw.message;
    domainEntity.site_id = raw.site_id;
    domainEntity.camera_id = raw.camera_id;
    domainEntity.priority = raw.priority;
    domainEntity.is_read = raw.is_read;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: Notifications,
  ): NotificationsSchemaClass {
    const persistenceSchema = new NotificationsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.event_type = domainEntity.event_type;
    persistenceSchema.event_id = domainEntity.event_id;
    persistenceSchema.event_link = domainEntity.event_link;
    persistenceSchema.type = domainEntity.type;
    persistenceSchema.title = domainEntity.title;
    persistenceSchema.message = domainEntity.message;
    persistenceSchema.site_id = domainEntity.site_id;
    persistenceSchema.camera_id = domainEntity.camera_id;
    persistenceSchema.priority = domainEntity.priority;
    persistenceSchema.is_read = domainEntity.is_read;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
