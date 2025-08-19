import { Permissions } from "../../../../domain/permissions";
import { PermissionsSchemaClass } from "../entities/permissions.schema";

export class PermissionsMapper {
  public static toDomain(raw: PermissionsSchemaClass): Permissions {
    const domainEntity = new Permissions();
    domainEntity.id = raw._id.toString();
    domainEntity.name = raw.name;
    domainEntity.method = raw.method;
    domainEntity.path = raw.path;
    domainEntity.resourceKey = raw.resourceKey;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: Permissions,
  ): PermissionsSchemaClass {
    const persistenceSchema = new PermissionsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.name = domainEntity.name;
    persistenceSchema.method = domainEntity.method;
    persistenceSchema.path = domainEntity.path;
    persistenceSchema.resourceKey = domainEntity.resourceKey;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
