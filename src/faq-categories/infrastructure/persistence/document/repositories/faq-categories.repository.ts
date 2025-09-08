import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FaqCategoriesSchemaClass } from "../entities/faq-categories.schema";
import { FaqCategoriesRepository } from "../../faq-categories.repository";
import { FaqCategories } from "../../../../domain/faq-categories";
import { FaqCategoriesMapper } from "../mappers/faq-categories.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class FaqCategoriesDocumentRepository
  implements FaqCategoriesRepository
{
  constructor(
    @InjectModel(FaqCategoriesSchemaClass.name)
    private readonly faqCategoriesModel: Model<FaqCategoriesSchemaClass>,
  ) {}

  async create(data: FaqCategories): Promise<FaqCategories> {
    const persistenceModel = FaqCategoriesMapper.toPersistence(data);
    const createdEntity = new this.faqCategoriesModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return FaqCategoriesMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FaqCategories[]> {
    const entityObjects = await this.faqCategoriesModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      FaqCategoriesMapper.toDomain(entityObject),
    );
  }

  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<FaqCategories[]> {
    const entityObjects = await this.faqCategoriesModel
      .find(filter)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      FaqCategoriesMapper.toDomain(entityObject),
    );
  }

  async countWithFilter(filter: any): Promise<number> {
    return this.faqCategoriesModel.countDocuments(filter);
  }

  async findById(
    id: FaqCategories["id"],
  ): Promise<NullableType<FaqCategories>> {
    const entityObject = await this.faqCategoriesModel.findById(id);
    return entityObject ? FaqCategoriesMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: FaqCategories["id"][]): Promise<FaqCategories[]> {
    const entityObjects = await this.faqCategoriesModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      FaqCategoriesMapper.toDomain(entityObject),
    );
  }

  async update(
    id: FaqCategories["id"],
    payload: Partial<FaqCategories>,
  ): Promise<NullableType<FaqCategories>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.faqCategoriesModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.faqCategoriesModel.findOneAndUpdate(
      filter,
      FaqCategoriesMapper.toPersistence({
        ...FaqCategoriesMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? FaqCategoriesMapper.toDomain(entityObject) : null;
  }

  async remove(id: FaqCategories["id"]): Promise<void> {
    await this.faqCategoriesModel.deleteOne({ _id: id });
  }
}
