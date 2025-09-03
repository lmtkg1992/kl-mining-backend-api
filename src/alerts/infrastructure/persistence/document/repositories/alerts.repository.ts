import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AlertsSchemaClass } from "../entities/alerts.schema";
import { AlertsRepository } from "../../alerts.repository";
import { Alerts } from "../../../../domain/alerts";
import { AlertsMapper } from "../mappers/alerts.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class AlertsDocumentRepository implements AlertsRepository {
  constructor(
    @InjectModel(AlertsSchemaClass.name)
    private readonly alertsModel: Model<AlertsSchemaClass>,
  ) {}

  async create(data: Alerts): Promise<Alerts> {
    const persistenceModel = AlertsMapper.toPersistence(data);
    const createdEntity = new this.alertsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return AlertsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Alerts[]> {
    const entityObjects = await this.alertsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      AlertsMapper.toDomain(entityObject),
    );
  }

  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Alerts[]> {
    const entityObjects = await this.alertsModel
      .find(filter)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      AlertsMapper.toDomain(entityObject),
    );
  }

  async countWithFilter(filter: any): Promise<number> {
    return this.alertsModel.countDocuments(filter);
  } 

  async findById(id: Alerts["id"]): Promise<NullableType<Alerts>> {
    const entityObject = await this.alertsModel.findById(id);
    return entityObject ? AlertsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Alerts["id"][]): Promise<Alerts[]> {
    const entityObjects = await this.alertsModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      AlertsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Alerts["id"],
    payload: Partial<Alerts>,
  ): Promise<NullableType<Alerts>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.alertsModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.alertsModel.findOneAndUpdate(
      filter,
      AlertsMapper.toPersistence({
        ...AlertsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? AlertsMapper.toDomain(entityObject) : null;
  }

  async remove(id: Alerts["id"]): Promise<void> {
    await this.alertsModel.deleteOne({ _id: id });
  }
}
