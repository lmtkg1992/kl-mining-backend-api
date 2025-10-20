import { MiningSitesModule } from "../mining-sites/mining-sites.module";
import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { PersonnelsService } from "./personnels.service";
import { PersonnelsController } from "./personnels.controller";
import { DocumentPersonnelPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    MiningSitesModule,

    // do not remove this comment
    DocumentPersonnelPersistenceModule,
  ],
  controllers: [PersonnelsController],
  providers: [PersonnelsService],
  exports: [PersonnelsService, DocumentPersonnelPersistenceModule],
})
export class PersonnelsModule {}
