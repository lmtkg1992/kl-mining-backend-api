import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  FaqCategoriesSchema,
  FaqCategoriesSchemaClass,
} from "./entities/faq-categories.schema";
import { FaqCategoriesRepository } from "../faq-categories.repository";
import { FaqCategoriesDocumentRepository } from "./repositories/faq-categories.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FaqCategoriesSchemaClass.name, schema: FaqCategoriesSchema },
    ]),
  ],
  providers: [
    {
      provide: FaqCategoriesRepository,
      useClass: FaqCategoriesDocumentRepository,
    },
  ],
  exports: [FaqCategoriesRepository],
})
export class DocumentFaqCategoriesPersistenceModule {}
