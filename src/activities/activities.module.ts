import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { ActivitiesService } from "./activities.service";
import { ActivitiesController } from "./activities.controller";
import { DocumentActivitiesPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentActivitiesPersistenceModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService, DocumentActivitiesPersistenceModule],
})
export class ActivitiesModule {}
