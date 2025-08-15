import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AdminUserGroupsSchemaClass } from "../entities/admin-user-groups.schema";
import { AdminUserGroupsRepository } from "../../admin-user-groups.repository";
import { AdminUserGroups } from "../../../../domain/admin-user-groups";
import { AdminUserGroupsMapper } from "../mappers/admin-user-groups.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class AdminUserGroupsDocumentRepository
  implements AdminUserGroupsRepository
{
  constructor(
    @InjectModel(AdminUserGroupsSchemaClass.name)
    private readonly adminUserGroupsModel: Model<AdminUserGroupsSchemaClass>,
  ) {}

  async create(data: AdminUserGroups): Promise<AdminUserGroups> {
    const persistenceModel = AdminUserGroupsMapper.toPersistence(data);
    const createdEntity = new this.adminUserGroupsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return AdminUserGroupsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AdminUserGroups[]> {
    const entityObjects = await this.adminUserGroupsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      AdminUserGroupsMapper.toDomain(entityObject),
    );
  }

  async findById(
    id: AdminUserGroups["id"],
  ): Promise<NullableType<AdminUserGroups>> {
    const entityObject = await this.adminUserGroupsModel.findById(id);
    return entityObject ? AdminUserGroupsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: AdminUserGroups["id"][]): Promise<AdminUserGroups[]> {
    const entityObjects = await this.adminUserGroupsModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      AdminUserGroupsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: AdminUserGroups["id"],
    payload: Partial<AdminUserGroups>,
  ): Promise<NullableType<AdminUserGroups>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.adminUserGroupsModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.adminUserGroupsModel.findOneAndUpdate(
      filter,
      AdminUserGroupsMapper.toPersistence({
        ...AdminUserGroupsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? AdminUserGroupsMapper.toDomain(entityObject) : null;
  }

  async remove(id: AdminUserGroups["id"]): Promise<void> {
    await this.adminUserGroupsModel.deleteOne({ _id: id });
  }
}
