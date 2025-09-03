import { Faqs } from "../../../../domain/faqs";
import { FaqsSchemaClass } from "../entities/faqs.schema";

export class FaqsMapper {
  public static toDomain(raw: FaqsSchemaClass): Faqs {
    const domainEntity = new Faqs();
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
