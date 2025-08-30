import { AiCameraStatusEnum, AiCameraFeatureEnum, AiCameraTypeEnum } from "src/ai-cameras/ai-cameras.enum";
import { AiCameras } from "../../../../domain/ai-cameras";
import { AiCamerasSchemaClass } from "../entities/ai-cameras.schema";
import { MiningSites } from "src/mining-sites/domain/mining-sites";
import { Types } from "mongoose";

export class AiCamerasMapper {
  public static toDomain(raw: AiCamerasSchemaClass): AiCameras {
    const domainEntity = new AiCameras();
    domainEntity.id = raw._id.toString();
    domainEntity.code = raw.code;
    domainEntity.site_id = {
      id: raw.site_id.toString(),
    } as MiningSites;
    if (raw.site_id && typeof raw.site_id === "object") {
      const siteData = raw.site_id as any;
      const { _id, siteName } = siteData;
      domainEntity.site_id = {
        id: _id?.toString() ?? "",
        siteName
      } as MiningSites;
    }
    domainEntity.type = raw.type as AiCameraTypeEnum  ;
    domainEntity.location_description = raw.location_description;
    domainEntity.ai_features = raw.ai_features as AiCameraFeatureEnum[];
    domainEntity.status = raw.status as AiCameraStatusEnum;
    domainEntity.url_live_stream = raw.url_live_stream;
    domainEntity.installed_at = raw.installed_at;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: AiCameras): AiCamerasSchemaClass {
    const persistenceSchema = new AiCamerasSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.code = domainEntity.code;
    persistenceSchema.site_id = domainEntity.site_id?.id ?? "";
    persistenceSchema.type = domainEntity.type;
    persistenceSchema.location_description = domainEntity.location_description;
    persistenceSchema.ai_features = domainEntity.ai_features;
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.url_live_stream = domainEntity.url_live_stream;
    persistenceSchema.installed_at = domainEntity.installed_at;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
