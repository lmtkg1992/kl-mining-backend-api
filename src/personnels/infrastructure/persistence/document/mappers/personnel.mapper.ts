import { Personnel } from "../../../../domain/personnel";
import { MiningSitesMapper } from "../../../../../mining-sites/infrastructure/persistence/document/mappers/mining-sites.mapper";
import { PersonnelSchemaClass } from "../entities/personnel.schema";
import { PersonnelStatus } from "../../../../domain/personnel-status.enum";

export class PersonnelMapper {
  public static toDomain(raw: PersonnelSchemaClass): Personnel {
    const domainEntity = new Personnel();
    if (raw.site_ids) {
      domainEntity.site_ids = raw.site_ids.map((item) =>
        MiningSitesMapper.toDomain(item),
      );
    } else if (raw.site_ids === null) {
      domainEntity.site_ids = null;
    }

    domainEntity.phone_number = raw.phone_number;

    domainEntity.personal_email = raw.personal_email;

    domainEntity.date_joined = raw.date_joined;

    domainEntity.department = raw.department;

    domainEntity.job_title = raw.job_title;

    domainEntity.avatar_url = raw.avatar_url;

    domainEntity.full_name = raw.full_name;
    domainEntity.status = raw.status as PersonnelStatus;

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Personnel): PersonnelSchemaClass {
    const persistenceSchema = new PersonnelSchemaClass();
    if (domainEntity.site_ids) {
      persistenceSchema.site_ids = domainEntity.site_ids.map((item) =>
        MiningSitesMapper.toPersistence(item),
      );
    } else if (domainEntity.site_ids === null) {
      persistenceSchema.site_ids = null;
    }

    persistenceSchema.phone_number = domainEntity.phone_number;

    persistenceSchema.personal_email = domainEntity.personal_email;

    persistenceSchema.date_joined = domainEntity.date_joined;

    persistenceSchema.department = domainEntity.department;

    persistenceSchema.job_title = domainEntity.job_title;

    persistenceSchema.avatar_url = domainEntity.avatar_url;

    persistenceSchema.full_name = domainEntity.full_name;

    persistenceSchema.status = domainEntity.status as PersonnelStatus;

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
