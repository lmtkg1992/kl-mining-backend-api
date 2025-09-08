import { Faqs } from "../../../../domain/faqs";
import { FaqCategoriesMapper } from "../../../../../faq-categories/infrastructure/persistence/document/mappers/faq-categories.mapper";

import { FaqsSchemaClass } from "../entities/faqs.schema";

export class FaqsMapper {
  public static toDomain(raw: FaqsSchemaClass): Faqs {
    const domainEntity = new Faqs();
    if (raw.categories) {
      domainEntity.categories = FaqCategoriesMapper.toDomain(raw.categories);
    }

    domainEntity.id = raw._id.toString();
    domainEntity.question = raw.question;
    domainEntity.answer = raw.answer;
    domainEntity.image_url = raw.image_url;
    domainEntity.order = raw.order;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Faqs): FaqsSchemaClass {
    const persistenceSchema = new FaqsSchemaClass();
    if (domainEntity.categories) {
      persistenceSchema.categories = FaqCategoriesMapper.toPersistence(
        domainEntity.categories,
      );
    }

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.question = domainEntity.question;
    persistenceSchema.answer = domainEntity.answer;
    persistenceSchema.image_url = domainEntity.image_url;
    persistenceSchema.order = domainEntity.order;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
