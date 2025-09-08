import { FaqsModule } from "../faqs/faqs.module";
import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { FaqCategoriesService } from "./faq-categories.service";
import { FaqCategoriesController } from "./faq-categories.controller";
import { DocumentFaqCategoriesPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    forwardRef(() => FaqsModule),
    DocumentFaqCategoriesPersistenceModule,
  ],
  controllers: [FaqCategoriesController],
  providers: [FaqCategoriesService],
  exports: [FaqCategoriesService, DocumentFaqCategoriesPersistenceModule],
})
export class FaqCategoriesModule {}
