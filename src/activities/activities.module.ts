import { TrucksModule } from "../trucks/trucks.module";
import { AiCamerasModule } from "../ai-cameras/ai-cameras.module";
import { MiningSitesModule } from "../mining-sites/mining-sites.module";
import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { ActivitiesService } from "./activities.service";
import { ActivitiesController } from "./activities.controller";
import { DocumentActivitiesPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentActivitiesPersistenceModule,
    forwardRef(() => TrucksModule),
    forwardRef(() => MiningSitesModule),
    forwardRef(() => AiCamerasModule),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService, DocumentActivitiesPersistenceModule],
})
export class ActivitiesModule {}
