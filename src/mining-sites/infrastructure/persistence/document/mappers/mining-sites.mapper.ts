import { MiningSites } from "../../../../domain/mining-sites";
import { MiningSitesSchemaClass } from "../entities/mining-sites.schema";

export class MiningSitesMapper {
  public static toDomain(raw: MiningSitesSchemaClass): MiningSites {
    const domainEntity = new MiningSites();
    domainEntity.id = raw._id.toString();
    domainEntity.siteName = raw.siteName;
    domainEntity.ownerUserId = raw.ownerUserId;
    domainEntity.provinceId = raw.provinceId;
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
    persistenceSchema.ownerUserId = domainEntity.ownerUserId;
    persistenceSchema.provinceId = domainEntity.provinceId;
    persistenceSchema.boundaryPolygon = domainEntity.boundaryPolygon || "";
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
