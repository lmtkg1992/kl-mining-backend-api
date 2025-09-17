import { AiCamerasModule } from "../ai-cameras/ai-cameras.module";
import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { AiSnapshotsService } from "./ai-snapshots.service";
import { AiSnapshotsController } from "./ai-snapshots.controller";
import { DocumentAiSnapshotsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentAiSnapshotsPersistenceModule,
    forwardRef(() => AiCamerasModule),
  ],
  controllers: [AiSnapshotsController],
  providers: [AiSnapshotsService],
  exports: [AiSnapshotsService, DocumentAiSnapshotsPersistenceModule],
})
export class AiSnapshotsModule {}
