import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { MiningSitesService } from "./mining-sites.service";
import { MiningSitesController } from "./mining-sites.controller";
import { DocumentMiningSitesPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentMiningSitesPersistenceModule,
  ],
  controllers: [MiningSitesController],
  providers: [MiningSitesService],
  exports: [MiningSitesService, DocumentMiningSitesPersistenceModule],
})
export class MiningSitesModule {}
