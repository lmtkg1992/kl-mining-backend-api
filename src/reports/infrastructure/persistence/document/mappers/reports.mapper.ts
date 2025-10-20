import { Reports } from "../../../../domain/reports";
import { AdminUsersMapper } from "../../../../../admin-users/infrastructure/persistence/document/mappers/admin-users.mapper";
import { ProvincesMapper } from "../../../../../provinces/infrastructure/persistence/document/mappers/provinces.mapper";
import { MiningSitesMapper } from "../../../../../mining-sites/infrastructure/persistence/document/mappers/mining-sites.mapper";
import { ReportsSchemaClass } from "../entities/reports.schema";

export class ReportsMapper {
  public static toDomain(raw: ReportsSchemaClass): Reports {
    const domainEntity = new Reports();

    domainEntity.id = raw._id.toString();
    domainEntity.report_type = raw.report_type;
    domainEntity.status = raw.status;
    domainEntity.export_format = raw.export_format;
    domainEntity.report_name = raw.report_name;

    if (raw.site_id) {
      // Handle ObjectId string reference
      domainEntity.site_id = MiningSitesMapper.toDomain(raw.site_id);
    }

    if (raw.province_id) {
      // Handle ObjectId string reference
      domainEntity.province_id = ProvincesMapper.toDomain(raw.province_id);
    }

    domainEntity.start_date = raw.start_date;
    domainEntity.end_date = raw.end_date;

    if (raw.generated_by) {
      // Handle ObjectId string reference
      domainEntity.generated_by = AdminUsersMapper.toDomain(raw.generated_by);
    }

    domainEntity.generated_at = raw.generated_at;

    domainEntity.content_metadata = raw.content_metadata;
    domainEntity.file_metadata = raw.file_metadata;

    // Handle file_url - convert from JSON string to object if needed
    if (raw.file_url) {
      try {
        domainEntity.file_url = JSON.parse(raw.file_url);
      } catch {
        // If not JSON, treat as regular string and convert to object format
        domainEntity.file_url = { pdf: raw.file_url };
      }
    }

    domainEntity.comments = raw.comments;
    domainEntity.report_options = raw.report_options;
    domainEntity.snapshots = raw.snapshots;

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Reports): ReportsSchemaClass {
    const persistenceSchema = new ReportsSchemaClass();

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }

    persistenceSchema.report_type = domainEntity.report_type;
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.export_format = domainEntity.export_format;
    persistenceSchema.report_name = domainEntity.report_name;

    if (domainEntity.site_id) {
      // Handle domain entity reference
      persistenceSchema.site_id = MiningSitesMapper.toPersistence(
        domainEntity.site_id,
      );
    }

    if (domainEntity.province_id) {
      // Handle domain entity reference
      persistenceSchema.province_id = ProvincesMapper.toPersistence(
        domainEntity.province_id,
      );
    }

    persistenceSchema.start_date = domainEntity.start_date;
    persistenceSchema.end_date = domainEntity.end_date;

    if (domainEntity.generated_by) {
      // Handle domain entity reference
      persistenceSchema.generated_by = AdminUsersMapper.toPersistence(
        domainEntity.generated_by,
      );
    }

    persistenceSchema.generated_at = domainEntity.generated_at;

    persistenceSchema.content_metadata = domainEntity.content_metadata;
    persistenceSchema.file_metadata = domainEntity.file_metadata;

    // Handle file_url - always convert to JSON string for storage
    if (domainEntity.file_url) {
      persistenceSchema.file_url = JSON.stringify(domainEntity.file_url);
    }

    persistenceSchema.comments = domainEntity.comments;
    persistenceSchema.report_options = domainEntity.report_options;
    persistenceSchema.snapshots = domainEntity.snapshots;

    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
