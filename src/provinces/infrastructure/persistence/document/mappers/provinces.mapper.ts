import { Provinces } from "../../../../domain/provinces";
import { ProvincesSchemaClass } from "../entities/provinces.schema";

export class ProvincesMapper {
  public static toDomain(raw: ProvincesSchemaClass): Provinces {
    const domainEntity = new Provinces();
    domainEntity.id = raw._id.toString();
    domainEntity.province_name = raw.province_name;
    domainEntity.province_code = raw.province_code;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Provinces): ProvincesSchemaClass {
    const persistenceSchema = new ProvincesSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.province_name = domainEntity.province_name;
    persistenceSchema.province_code = domainEntity.province_code;
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
