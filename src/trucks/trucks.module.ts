import { MiningSitesModule } from "../mining-sites/mining-sites.module";
import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { TrucksService } from "./trucks.service";
import { TrucksController } from "./trucks.controller";
import { DocumentTrucksPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    forwardRef(() => MiningSitesModule),
    // do not remove this comment
    DocumentTrucksPersistenceModule,
  ],
  controllers: [TrucksController],
  providers: [TrucksService],
  exports: [TrucksService, DocumentTrucksPersistenceModule],
})
export class TrucksModule {}
