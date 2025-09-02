import { MiningSites } from "../../../../domain/mining-sites";
import { MiningSitesSchemaClass } from "../entities/mining-sites.schema";
import { Provinces } from "../../../../../provinces/domain/provinces";
import { AdminUsers } from "src/admin-users/domain/admin-users";

export class MiningSitesMapper {
  public static toDomain(raw: MiningSitesSchemaClass): MiningSites {
    const domainEntity = new MiningSites();
    domainEntity.id = raw._id.toString();
    domainEntity.site_name = raw.site_name;
    domainEntity.site_code = raw.site_code;
    domainEntity.status = raw.status;

    if (raw.owner_user_id && typeof raw.owner_user_id === "object") {
      const ownerUserData = raw.owner_user_id as any;
      const { _id, email, name } = ownerUserData;
      domainEntity.owner_user_id = {
        id: _id?.toString() ?? "",
        email,
        name,
      } as AdminUsers;
    }

    if (raw.province && typeof raw.province === "object") {
      const groupData = raw.province as any;
      const { _id, ...leftGroupData } = groupData;
      domainEntity.province = {
        id: _id?.toString() ?? "",
        ...leftGroupData,
      } as Provinces;
    }

    domainEntity.boundary_polygon = raw.boundary_polygon;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: MiningSites,
  ): MiningSitesSchemaClass {
    const persistenceSchema = new MiningSitesSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.site_name = domainEntity.site_name;
    persistenceSchema.site_code = domainEntity.site_code;
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.owner_user_id = domainEntity.owner_user_id?.id ?? "";
    persistenceSchema.boundary_polygon = domainEntity.boundary_polygon || "";
    persistenceSchema.province = domainEntity.province?.id ?? "";
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
