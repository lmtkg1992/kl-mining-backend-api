import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { FaqsService } from "./faqs.service";
import { FaqsController } from "./faqs.controller";
import { DocumentFaqsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";
import { FaqCategoriesModule } from "../faq-categories/faq-categories.module";

@Module({
  imports: [
    // do not remove this comment
    forwardRef(() => FaqCategoriesModule),
    DocumentFaqsPersistenceModule,
  ],
  controllers: [FaqsController],
  providers: [FaqsService],
  exports: [FaqsService, DocumentFaqsPersistenceModule],
})
export class FaqsModule {}
