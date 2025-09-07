import { AdminUsers } from "../../../../../admin-users/domain/admin-users";
import { AdminUserSettings } from "../../../../domain/admin-user-settings";
import { AdminUserSettingsSchemaClass } from "../entities/admin-user-settings.schema";

export class AdminUserSettingsMapper {
  public static toDomain(raw: AdminUserSettingsSchemaClass): AdminUserSettings {
    const domainEntity = new AdminUserSettings();
    domainEntity.id = raw._id.toString();
    if (raw.admin_user_id && typeof raw.admin_user_id === "object") {
      const adminUserData = raw.admin_user_id as any;
      const { _id, email, name } = adminUserData;
      domainEntity.admin_user_id = {
        id: _id?.toString() ?? "",
        email,
        name,
      } as AdminUsers;
    }
    domainEntity.security_breach_alerts = raw.security_breach_alerts;
    domainEntity.truck_detection_alerts = raw.truck_detection_alerts;
    domainEntity.camera_health_alerts = raw.camera_health_alerts;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: AdminUserSettings,
  ): AdminUserSettingsSchemaClass {
    const persistenceSchema = new AdminUserSettingsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.admin_user_id = domainEntity.admin_user_id?.id ?? "";
    persistenceSchema.security_breach_alerts =
      domainEntity.security_breach_alerts;
    persistenceSchema.truck_detection_alerts =
      domainEntity.truck_detection_alerts;
    persistenceSchema.camera_health_alerts = domainEntity.camera_health_alerts;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
