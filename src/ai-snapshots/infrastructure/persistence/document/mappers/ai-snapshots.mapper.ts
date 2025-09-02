import { AiSnapshots } from "../../../../domain/ai-snapshots";
import { AiSnapshotsSchemaClass } from "../entities/ai-snapshots.schema";

export class AiSnapshotsMapper {
  public static toDomain(raw: AiSnapshotsSchemaClass): AiSnapshots {
    const domainEntity = new AiSnapshots();
    domainEntity.id = raw._id.toString();
    domainEntity.camera_id = raw.camera_id;
    domainEntity.event_type = raw.event_type;
    domainEntity.image_url = raw.image_url;
    domainEntity.truck_type = raw.truck_type;
    domainEntity.fill_level = raw.fill_level;
    domainEntity.confidence_score = raw.confidence_score;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: AiSnapshots,
  ): AiSnapshotsSchemaClass {
    const persistenceSchema = new AiSnapshotsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.camera_id = domainEntity.camera_id;
    persistenceSchema.event_type = domainEntity.event_type;
    persistenceSchema.image_url = domainEntity.image_url;
    persistenceSchema.truck_type = domainEntity.truck_type;
    persistenceSchema.fill_level = domainEntity.fill_level;
    persistenceSchema.confidence_score = domainEntity.confidence_score;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
