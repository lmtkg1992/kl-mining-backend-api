import { MiningSites } from "../../../../domain/mining-sites";
import { MiningSitesSchemaClass } from "../entities/mining-sites.schema";
import { Provinces } from "../../../../../provinces/domain/provinces";

export class MiningSitesMapper {
  public static toDomain(raw: MiningSitesSchemaClass): MiningSites {
    const domainEntity = new MiningSites();
    domainEntity.id = raw._id.toString();
    domainEntity.siteName = raw.siteName;
    domainEntity.status = raw.status;
    domainEntity.ownerUserId = raw.ownerUserId;

    if (raw.province && typeof raw.province === "object") {
      const groupData = raw.province as any;
      const { _id, ...leftGroupData } = groupData;
      domainEntity.province = {
        id: _id?.toString() ?? "",
        ...leftGroupData,
      } as Provinces;
    }

    domainEntity.boundaryPolygon = raw.boundaryPolygon;
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
    persistenceSchema.siteName = domainEntity.siteName;
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.ownerUserId = domainEntity.ownerUserId;
    persistenceSchema.boundaryPolygon = domainEntity.boundaryPolygon || "";
    persistenceSchema.province = domainEntity.province?.id ?? "";
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
