import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { AiCamerasService } from "./ai-cameras.service";
import { AiCamerasController } from "./ai-cameras.controller";
import { DocumentAiCamerasPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";
import { MiningSitesModule } from "../mining-sites/mining-sites.module";
import { SynologyService } from "./services/synology.service";

@Module({
  imports: [
    // do not remove this comment
    DocumentAiCamerasPersistenceModule,
    forwardRef(() => MiningSitesModule),
  ],
  controllers: [AiCamerasController],
  providers: [AiCamerasService, SynologyService],
  exports: [AiCamerasService, DocumentAiCamerasPersistenceModule],
})
export class AiCamerasModule {}
