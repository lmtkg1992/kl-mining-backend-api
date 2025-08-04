import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { ProvincesService } from "./provinces.service";
import { ProvincesController } from "./provinces.controller";
import { DocumentProvincesPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentProvincesPersistenceModule,
  ],
  controllers: [ProvincesController],
  providers: [ProvincesService],
  exports: [ProvincesService, DocumentProvincesPersistenceModule],
})
export class ProvincesModule {}
