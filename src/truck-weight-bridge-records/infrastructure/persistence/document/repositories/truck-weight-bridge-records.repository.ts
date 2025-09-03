import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TruckWeightBridgeRecordsSchemaClass } from "../entities/truck-weight-bridge-records.schema";
import { TruckWeightBridgeRecordsRepository } from "../../truck-weight-bridge-records.repository";
import { TruckWeightBridgeRecords } from "../../../../domain/truck-weight-bridge-records";
import { TruckWeightBridgeRecordsMapper } from "../mappers/truck-weight-bridge-records.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class TruckWeightBridgeRecordsDocumentRepository
  implements TruckWeightBridgeRecordsRepository
{
  constructor(
    @InjectModel(TruckWeightBridgeRecordsSchemaClass.name)
    private readonly truckWeightBridgeRecordsModel: Model<TruckWeightBridgeRecordsSchemaClass>,
  ) {}

  async create(
    data: TruckWeightBridgeRecords,
  ): Promise<TruckWeightBridgeRecords> {
    const persistenceModel = TruckWeightBridgeRecordsMapper.toPersistence(data);
    const createdEntity = new this.truckWeightBridgeRecordsModel(
      persistenceModel,
    );
    const entityObject = await createdEntity.save();
    return TruckWeightBridgeRecordsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<TruckWeightBridgeRecords[]> {
    const entityObjects = await this.truckWeightBridgeRecordsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      TruckWeightBridgeRecordsMapper.toDomain(entityObject),
    );
  }

  async findById(
    id: TruckWeightBridgeRecords["id"],
  ): Promise<NullableType<TruckWeightBridgeRecords>> {
    const entityObject = await this.truckWeightBridgeRecordsModel.findById(id);
    return entityObject
      ? TruckWeightBridgeRecordsMapper.toDomain(entityObject)
      : null;
  }

  async findByIds(
    ids: TruckWeightBridgeRecords["id"][],
  ): Promise<TruckWeightBridgeRecords[]> {
    const entityObjects = await this.truckWeightBridgeRecordsModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      TruckWeightBridgeRecordsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: TruckWeightBridgeRecords["id"],
    payload: Partial<TruckWeightBridgeRecords>,
  ): Promise<NullableType<TruckWeightBridgeRecords>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.truckWeightBridgeRecordsModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject =
      await this.truckWeightBridgeRecordsModel.findOneAndUpdate(
        filter,
        TruckWeightBridgeRecordsMapper.toPersistence({
          ...TruckWeightBridgeRecordsMapper.toDomain(entity),
          ...clonedPayload,
        }),
        { new: true },
      );

    return entityObject
      ? TruckWeightBridgeRecordsMapper.toDomain(entityObject)
      : null;
  }

  async remove(id: TruckWeightBridgeRecords["id"]): Promise<void> {
    await this.truckWeightBridgeRecordsModel.deleteOne({ _id: id });
  }
}
