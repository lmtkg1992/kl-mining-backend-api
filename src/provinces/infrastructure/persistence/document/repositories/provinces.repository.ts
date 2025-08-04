import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProvincesSchemaClass } from "../entities/provinces.schema";
import { ProvincesRepository } from "../../provinces.repository";
import { Provinces } from "../../../../domain/provinces";
import { ProvincesMapper } from "../mappers/provinces.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class ProvincesDocumentRepository implements ProvincesRepository {
  constructor(
    @InjectModel(ProvincesSchemaClass.name)
    private readonly provincesModel: Model<ProvincesSchemaClass>,
  ) {}

  async create(data: Provinces): Promise<Provinces> {
    const persistenceModel = ProvincesMapper.toPersistence(data);
    const createdEntity = new this.provincesModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return ProvincesMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Provinces[]> {
    const entityObjects = await this.provincesModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      ProvincesMapper.toDomain(entityObject),
    );
  }

  async findById(id: Provinces["id"]): Promise<NullableType<Provinces>> {
    const entityObject = await this.provincesModel.findById(id);
    return entityObject ? ProvincesMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Provinces["id"][]): Promise<Provinces[]> {
    const entityObjects = await this.provincesModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      ProvincesMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Provinces["id"],
    payload: Partial<Provinces>,
  ): Promise<NullableType<Provinces>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.provincesModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.provincesModel.findOneAndUpdate(
      filter,
      ProvincesMapper.toPersistence({
        ...ProvincesMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? ProvincesMapper.toDomain(entityObject) : null;
  }

  async remove(id: Provinces["id"]): Promise<void> {
    await this.provincesModel.deleteOne({ _id: id });
  }
}
