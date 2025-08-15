import { AdminUserGroups } from "src/admin-user-groups/domain/admin-user-groups";
import { AdminUsers } from "../../../../domain/admin-users";
import { AdminUsersSchemaClass } from "../entities/admin-users.schema";

export class AdminUsersMapper {
  public static toDomain(raw: AdminUsersSchemaClass): AdminUsers {
    const domainEntity = new AdminUsers();
    domainEntity.id = raw._id.toString();
    domainEntity.email = raw.email;
    domainEntity.name = raw.name;
    domainEntity.status = raw.status;
    domainEntity.password = raw.password ?? undefined;

    if (raw.admin_user_group && typeof raw.admin_user_group === "object") {
      const groupData = raw.admin_user_group as any;
      const { _id, ...leftGroupData } = groupData;
      domainEntity.admin_user_group = {
        id: _id?.toString() ?? "",
        ...leftGroupData,
      } as AdminUserGroups;
    }

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: AdminUsers): AdminUsersSchemaClass {
    const persistenceSchema = new AdminUsersSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.email = domainEntity.email;
    persistenceSchema.name = domainEntity.name;
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.password = domainEntity.password;
    persistenceSchema.admin_user_group =
      domainEntity.admin_user_group?.id ?? "";
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
