import { AiCamerasModule } from "../ai-cameras/ai-cameras.module";
import { AlertsModule } from "../alerts/alerts.module";
import { TrucksModule } from "../trucks/trucks.module";
import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { AiSnapshotsService } from "./ai-snapshots.service";
import { AiSnapshotsController } from "./ai-snapshots.controller";
import { DocumentAiSnapshotsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";
import { FixedTokenGuard } from "./guards/fixed-token.guard";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    // do not remove this comment
    DocumentAiSnapshotsPersistenceModule,
    forwardRef(() => AiCamerasModule),
    forwardRef(() => AlertsModule),
    forwardRef(() => TrucksModule),
    ConfigModule,
  ],
  controllers: [AiSnapshotsController],
  providers: [AiSnapshotsService, FixedTokenGuard],
  exports: [AiSnapshotsService, DocumentAiSnapshotsPersistenceModule],
})
export class AiSnapshotsModule {}
