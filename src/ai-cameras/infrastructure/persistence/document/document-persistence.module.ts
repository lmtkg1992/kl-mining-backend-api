import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  AiCamerasSchema,
  AiCamerasSchemaClass,
} from "./entities/ai-cameras.schema";
import { AiCamerasRepository } from "../ai-cameras.repository";
import { AiCamerasDocumentRepository } from "./repositories/ai-cameras.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiCamerasSchemaClass.name, schema: AiCamerasSchema },
    ]),
  ],
  providers: [
    {
      provide: AiCamerasRepository,
      useClass: AiCamerasDocumentRepository,
    },
  ],
  exports: [AiCamerasRepository],
})
export class DocumentAiCamerasPersistenceModule {}
