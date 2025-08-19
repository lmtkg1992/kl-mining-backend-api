import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PermissionsSchemaClass } from "../entities/permissions.schema";
import { PermissionsRepository } from "../../permissions.repository";
import { Permissions } from "../../../../domain/permissions";
import { PermissionsMapper } from "../mappers/permissions.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class PermissionsDocumentRepository implements PermissionsRepository {
  constructor(
    @InjectModel(PermissionsSchemaClass.name)
    private readonly permissionsModel: Model<PermissionsSchemaClass>,
  ) {}

  async create(data: Permissions): Promise<Permissions> {
    const persistenceModel = PermissionsMapper.toPersistence(data);
    const createdEntity = new this.permissionsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return PermissionsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Permissions[]> {
    const entityObjects = await this.permissionsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      PermissionsMapper.toDomain(entityObject),
    );
  }

  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Permissions[]> {
    const entityObjects = await this.permissionsModel
      .find(filter)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .lean();

    return entityObjects.map((entityObject) =>
      PermissionsMapper.toDomain(entityObject),
    );
  }

  async countWithFilter(filter: any): Promise<number> {
    return this.permissionsModel.countDocuments(filter);
  }

  async findById(id: Permissions["id"]): Promise<NullableType<Permissions>> {
    const entityObject = await this.permissionsModel.findById(id);
    return entityObject ? PermissionsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Permissions["id"][]): Promise<Permissions[]> {
    const entityObjects = await this.permissionsModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      PermissionsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Permissions["id"],
    payload: Partial<Permissions>,
  ): Promise<NullableType<Permissions>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.permissionsModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.permissionsModel.findOneAndUpdate(
      filter,
      PermissionsMapper.toPersistence({
        ...PermissionsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? PermissionsMapper.toDomain(entityObject) : null;
  }

  async remove(id: Permissions["id"]): Promise<void> {
    await this.permissionsModel.deleteOne({ _id: id });
  }
}
