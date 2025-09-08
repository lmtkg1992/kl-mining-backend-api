import { FaqCategories } from "../../../../domain/faq-categories";
import { FaqsMapper } from "../../../../../faqs/infrastructure/persistence/document/mappers/faqs.mapper";

import { FaqCategoriesSchemaClass } from "../entities/faq-categories.schema";

export class FaqCategoriesMapper {
  public static toDomain(raw: FaqCategoriesSchemaClass): FaqCategories {
    const domainEntity = new FaqCategories();
    if (raw.faqs) {
      domainEntity.faqs = raw.faqs.map((item) => FaqsMapper.toDomain(item));
    } else if (raw.faqs === null) {
      domainEntity.faqs = null;
    }

    domainEntity.id = raw._id.toString();
    domainEntity.position = raw.position;
    domainEntity.is_active = raw.is_active;
    domainEntity.description = raw.description;
    domainEntity.title = raw.title;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: FaqCategories,
  ): FaqCategoriesSchemaClass {
    const persistenceSchema = new FaqCategoriesSchemaClass();
    if (domainEntity.faqs) {
      persistenceSchema.faqs = domainEntity.faqs.map((item) =>
        FaqsMapper.toPersistence(item),
      );
    } else if (domainEntity.faqs === null) {
      persistenceSchema.faqs = null;
    }

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }

    persistenceSchema.position = domainEntity.position;
    persistenceSchema.is_active = domainEntity.is_active;
    persistenceSchema.description = domainEntity.description;
    persistenceSchema.title = domainEntity.title;

    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
