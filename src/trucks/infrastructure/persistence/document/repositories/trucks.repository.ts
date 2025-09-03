import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TrucksSchemaClass } from "../entities/trucks.schema";
import { TrucksRepository } from "../../trucks.repository";
import { Trucks } from "../../../../domain/trucks";
import { TrucksMapper } from "../mappers/trucks.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class TrucksDocumentRepository implements TrucksRepository {
  constructor(
    @InjectModel(TrucksSchemaClass.name)
    private readonly trucksModel: Model<TrucksSchemaClass>,
  ) {}

  async create(data: Trucks): Promise<Trucks> {
    const persistenceModel = TrucksMapper.toPersistence(data);
    const createdEntity = new this.trucksModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return TrucksMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Trucks[]> {
    const entityObjects = await this.trucksModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      TrucksMapper.toDomain(entityObject),
    );
  }

  async findById(id: Trucks["id"]): Promise<NullableType<Trucks>> {
    const entityObject = await this.trucksModel.findById(id);
    return entityObject ? TrucksMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Trucks["id"][]): Promise<Trucks[]> {
    const entityObjects = await this.trucksModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      TrucksMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Trucks["id"],
    payload: Partial<Trucks>,
  ): Promise<NullableType<Trucks>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.trucksModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.trucksModel.findOneAndUpdate(
      filter,
      TrucksMapper.toPersistence({
        ...TrucksMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? TrucksMapper.toDomain(entityObject) : null;
  }

  async remove(id: Trucks["id"]): Promise<void> {
    await this.trucksModel.deleteOne({ _id: id });
  }
}
