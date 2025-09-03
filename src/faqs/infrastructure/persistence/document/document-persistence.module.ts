import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FaqsSchema, FaqsSchemaClass } from "./entities/faqs.schema";
import { FaqsRepository } from "../faqs.repository";
import { FaqsDocumentRepository } from "./repositories/faqs.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FaqsSchemaClass.name, schema: FaqsSchema },
    ]),
  ],
  providers: [
    {
      provide: FaqsRepository,
      useClass: FaqsDocumentRepository,
    },
  ],
  exports: [FaqsRepository],
})
export class DocumentFaqsPersistenceModule {}
