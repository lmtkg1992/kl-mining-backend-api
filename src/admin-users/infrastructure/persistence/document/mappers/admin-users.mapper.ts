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
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
