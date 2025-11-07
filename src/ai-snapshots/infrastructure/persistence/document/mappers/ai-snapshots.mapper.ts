import { AiSnapshots } from "../../../../domain/ai-snapshots";
import { AiCamerasMapper } from "../../../../../ai-cameras/infrastructure/persistence/document/mappers/ai-cameras.mapper";

import { AiSnapshotsSchemaClass } from "../entities/ai-snapshots.schema";

export class AiSnapshotsMapper {
  public static toDomain(raw: AiSnapshotsSchemaClass): AiSnapshots {
    const domainEntity = new AiSnapshots();
    if (raw.camera_id) {
      domainEntity.camera_id = AiCamerasMapper.toDomain(raw.camera_id);
    } else if (raw.camera_id === null) {
      domainEntity.camera_id = null;
    }

    domainEntity.id = raw._id.toString();
    domainEntity.event_id = raw.event_id;
    domainEntity.event_type = raw.event_type;
    domainEntity.image_url = raw.image_url;
    domainEntity.truck_type = raw.truck_type;
    domainEntity.fill_level = raw.fill_level;
    domainEntity.confidence_score = raw.confidence_score;
    domainEntity.plate_number = raw.plate_number;
    domainEntity.camera_code = raw.camera_code;
    domainEntity.timestamp = raw.timestamp;
    domainEntity.direction = raw.direction;
    domainEntity.volume = raw.volume;
    domainEntity.status = raw.status;
    domainEntity.list_image_urls = raw.list_image_urls;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: AiSnapshots,
  ): AiSnapshotsSchemaClass {
    const persistenceSchema = new AiSnapshotsSchemaClass();
    if (domainEntity.camera_id) {
      persistenceSchema.camera_id = AiCamerasMapper.toPersistence(
        domainEntity.camera_id,
      );
    } else if (domainEntity.camera_id === null) {
      persistenceSchema.camera_id = null;
    }

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.event_id = domainEntity.event_id;
    persistenceSchema.event_type = domainEntity.event_type;
    persistenceSchema.image_url = domainEntity.image_url;
    persistenceSchema.truck_type = domainEntity.truck_type;
    persistenceSchema.fill_level = domainEntity.fill_level;
    persistenceSchema.confidence_score = domainEntity.confidence_score;
    persistenceSchema.plate_number = domainEntity.plate_number;
    persistenceSchema.camera_code = domainEntity.camera_code;
    persistenceSchema.timestamp = domainEntity.timestamp;
    persistenceSchema.direction = domainEntity.direction;
    persistenceSchema.volume = domainEntity.volume;
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.list_image_urls = domainEntity.list_image_urls;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
