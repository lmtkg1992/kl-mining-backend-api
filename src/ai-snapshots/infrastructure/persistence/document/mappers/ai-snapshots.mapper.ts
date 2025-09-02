import { AiSnapshots } from "../../../../domain/ai-snapshots";
import { AiSnapshotsSchemaClass } from "../entities/ai-snapshots.schema";

export class AiSnapshotsMapper {
  public static toDomain(raw: AiSnapshotsSchemaClass): AiSnapshots {
    const domainEntity = new AiSnapshots();
    domainEntity.id = raw._id.toString();
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
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
