import { ActivitiesModule } from "../activities/activities.module";
import { AiCamerasModule } from "../ai-cameras/ai-cameras.module";
import { TrucksModule } from "../trucks/trucks.module";
import { MiningSitesModule } from "../mining-sites/mining-sites.module";
import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { AlertsService } from "./alerts.service";
import { AlertsController } from "./alerts.controller";
import { DocumentAlertsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentAlertsPersistenceModule,
    forwardRef(() => ActivitiesModule),
    forwardRef(() => AiCamerasModule),
    forwardRef(() => TrucksModule),
    forwardRef(() => MiningSitesModule),
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService, DocumentAlertsPersistenceModule],
})
export class AlertsModule {}
