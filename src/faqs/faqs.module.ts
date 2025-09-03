import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { FaqsService } from "./faqs.service";
import { FaqsController } from "./faqs.controller";
import { DocumentFaqsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentFaqsPersistenceModule,
  ],
  controllers: [FaqsController],
  providers: [FaqsService],
  exports: [FaqsService, DocumentFaqsPersistenceModule],
})
export class FaqsModule {}
