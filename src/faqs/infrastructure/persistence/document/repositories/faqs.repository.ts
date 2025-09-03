import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FaqsSchemaClass } from "../entities/faqs.schema";
import { FaqsRepository } from "../../faqs.repository";
import { Faqs } from "../../../../domain/faqs";
import { FaqsMapper } from "../mappers/faqs.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class FaqsDocumentRepository implements FaqsRepository {
  constructor(
    @InjectModel(FaqsSchemaClass.name)
    private readonly faqsModel: Model<FaqsSchemaClass>,
  ) {}

  async create(data: Faqs): Promise<Faqs> {
    const persistenceModel = FaqsMapper.toPersistence(data);
    const createdEntity = new this.faqsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return FaqsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Faqs[]> {
    const entityObjects = await this.faqsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      FaqsMapper.toDomain(entityObject),
    );
  }

  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Faqs[]> {
    const entityObjects = await this.faqsModel
      .find(filter)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .lean();

    return entityObjects.map((entityObject) =>
      FaqsMapper.toDomain(entityObject),
    );
  }

  async countWithFilter(filter: any): Promise<number> {
    return this.faqsModel.countDocuments(filter);
  }

  async findById(id: Faqs["id"]): Promise<NullableType<Faqs>> {
    const entityObject = await this.faqsModel.findById(id);
    return entityObject ? FaqsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Faqs["id"][]): Promise<Faqs[]> {
    const entityObjects = await this.faqsModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      FaqsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Faqs["id"],
    payload: Partial<Faqs>,
  ): Promise<NullableType<Faqs>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.faqsModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.faqsModel.findOneAndUpdate(
      filter,
      FaqsMapper.toPersistence({
        ...FaqsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? FaqsMapper.toDomain(entityObject) : null;
  }

  async remove(id: Faqs["id"]): Promise<void> {
    await this.faqsModel.deleteOne({ _id: id });
  }
}
