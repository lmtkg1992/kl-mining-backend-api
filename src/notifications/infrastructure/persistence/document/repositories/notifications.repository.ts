import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NotificationsSchemaClass } from "../entities/notifications.schema";
import { NotificationsRepository } from "../../notifications.repository";
import { Notifications } from "../../../../domain/notifications";
import { NotificationsMapper } from "../mappers/notifications.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class NotificationsDocumentRepository
  implements NotificationsRepository
{
  constructor(
    @InjectModel(NotificationsSchemaClass.name)
    private readonly notificationsModel: Model<NotificationsSchemaClass>,
  ) {}

  async create(data: Notifications): Promise<Notifications> {
    const persistenceModel = NotificationsMapper.toPersistence(data);
    const createdEntity = new this.notificationsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return NotificationsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Notifications[]> {
    const entityObjects = await this.notificationsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      NotificationsMapper.toDomain(entityObject),
    );
  }

  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Notifications[]> {
    const entityObjects = await this.notificationsModel
      .find(filter)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      NotificationsMapper.toDomain(entityObject),
    );
  }   
  
  async countWithFilter(filter: any): Promise<number> {
    return this.notificationsModel.countDocuments(filter);
  }

  async findById(
    id: Notifications["id"],
  ): Promise<NullableType<Notifications>> {
    const entityObject = await this.notificationsModel.findById(id);
    return entityObject ? NotificationsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Notifications["id"][]): Promise<Notifications[]> {
    const entityObjects = await this.notificationsModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      NotificationsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Notifications["id"],
    payload: Partial<Notifications>,
  ): Promise<NullableType<Notifications>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.notificationsModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.notificationsModel.findOneAndUpdate(
      filter,
      NotificationsMapper.toPersistence({
        ...NotificationsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? NotificationsMapper.toDomain(entityObject) : null;
  }

  async remove(id: Notifications["id"]): Promise<void> {
    await this.notificationsModel.deleteOne({ _id: id });
  }
}
