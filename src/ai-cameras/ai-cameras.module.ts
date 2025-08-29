import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { AiCamerasService } from "./ai-cameras.service";
import { AiCamerasController } from "./ai-cameras.controller";
import { DocumentAiCamerasPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentAiCamerasPersistenceModule,
  ],
  controllers: [AiCamerasController],
  providers: [AiCamerasService],
  exports: [AiCamerasService, DocumentAiCamerasPersistenceModule],
})
export class AiCamerasModule {}
