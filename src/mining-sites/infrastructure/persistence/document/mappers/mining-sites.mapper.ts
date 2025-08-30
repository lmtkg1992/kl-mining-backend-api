import { MiningSites } from "../../../../domain/mining-sites";
import { MiningSitesSchemaClass } from "../entities/mining-sites.schema";
import { Provinces } from "../../../../../provinces/domain/provinces";

export class MiningSitesMapper {
  public static toDomain(raw: MiningSitesSchemaClass): MiningSites {
    const domainEntity = new MiningSites();
    domainEntity.id = raw._id.toString();
    domainEntity.site_name = raw.site_name;
    domainEntity.status = raw.status;
    domainEntity.owner_user_id = raw.owner_user_id;

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
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.owner_user_id = domainEntity.owner_user_id;
    persistenceSchema.boundary_polygon = domainEntity.boundary_polygon || "";
    persistenceSchema.province = domainEntity.province?.id ?? "";
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
