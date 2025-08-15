import { AdminUserGroups } from "../../../../domain/admin-user-groups";
import { AdminUserGroupsSchemaClass } from "../entities/admin-user-groups.schema";

export class AdminUserGroupsMapper {
  public static toDomain(raw: AdminUserGroupsSchemaClass): AdminUserGroups {
    const domainEntity = new AdminUserGroups();
    domainEntity.id = raw._id.toString();
    domainEntity.name = raw.name;
    domainEntity.status = raw.status;
    domainEntity.description = raw.description;
    domainEntity.role = raw.role;
    domainEntity.site_ids = JSON.parse(raw.site_ids);
    domainEntity.province_ids = JSON.parse(raw.province_ids);
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: AdminUserGroups,
  ): AdminUserGroupsSchemaClass {
    const persistenceSchema = new AdminUserGroupsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.name = domainEntity.name;
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.description = domainEntity.description;
    persistenceSchema.role = domainEntity.role;
    persistenceSchema.site_ids = JSON.stringify(domainEntity.site_ids);
    persistenceSchema.province_ids = JSON.stringify(domainEntity.province_ids);
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
