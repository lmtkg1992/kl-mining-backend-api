import { AiCameras } from "../../../../domain/ai-cameras";
import { AiCamerasSchemaClass } from "../entities/ai-cameras.schema";

export class AiCamerasMapper {
  public static toDomain(raw: AiCamerasSchemaClass): AiCameras {
    const domainEntity = new AiCameras();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: AiCameras): AiCamerasSchemaClass {
    const persistenceSchema = new AiCamerasSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
