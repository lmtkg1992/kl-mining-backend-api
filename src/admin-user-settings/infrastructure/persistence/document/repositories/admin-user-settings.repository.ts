import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AdminUserSettingsSchemaClass } from "../entities/admin-user-settings.schema";
import { AdminUserSettingsRepository } from "../../admin-user-settings.repository";
import { AdminUserSettings } from "../../../../domain/admin-user-settings";
import { AdminUserSettingsMapper } from "../mappers/admin-user-settings.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";
import { AdminUsersMapper } from "src/admin-users/infrastructure/persistence/document/mappers/admin-users.mapper";

@Injectable()
export class AdminUserSettingsDocumentRepository
  implements AdminUserSettingsRepository
{
  constructor(
    @InjectModel(AdminUserSettingsSchemaClass.name)
    private readonly adminUserSettingsModel: Model<AdminUserSettingsSchemaClass>,
  ) {}

  async create(data: AdminUserSettings): Promise<AdminUserSettings> {
    console.log(data);
    const persistenceModel = AdminUserSettingsMapper.toPersistence(data);
    const createdEntity = new this.adminUserSettingsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return AdminUserSettingsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AdminUserSettings[]> {
    const entityObjects = await this.adminUserSettingsModel
      .find()
      .populate({
        path: "admin_user_id",
      })
      .lean()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      AdminUserSettingsMapper.toDomain(entityObject),
    );
  }

  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<AdminUserSettings[]> {
    const entityObjects = await this.adminUserSettingsModel
      .find(filter)
      .populate({
        path: "admin_user_id",
      })
      .lean()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .lean();

    return entityObjects.map((entityObject) =>
      AdminUserSettingsMapper.toDomain(entityObject),
    );
  }

  async countWithFilter(filter: any): Promise<number> {
    return this.adminUserSettingsModel.countDocuments(filter);
  }

  async findById(
    id: AdminUserSettings["id"],
  ): Promise<NullableType<AdminUserSettings>> {
    const entityObject = await this.adminUserSettingsModel
      .findById(id)
      .populate({
        path: "admin_user_id",
      })
      .lean();
    return entityObject ? AdminUserSettingsMapper.toDomain(entityObject) : null;
  }

  async findByIds(
    ids: AdminUserSettings["id"][],
  ): Promise<AdminUserSettings[]> {
    const entityObjects = await this.adminUserSettingsModel
      .find({
        _id: { $in: ids },
      })
      .populate({
        path: "admin_user_id",
      })
      .lean();
    return entityObjects.map((entityObject) =>
      AdminUserSettingsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: AdminUserSettings["id"],
    payload: Partial<AdminUserSettings>,
  ): Promise<NullableType<AdminUserSettings>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.adminUserSettingsModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.adminUserSettingsModel.findOneAndUpdate(
      filter,
      AdminUserSettingsMapper.toPersistence({
        ...AdminUserSettingsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? AdminUserSettingsMapper.toDomain(entityObject) : null;
  }

  async remove(id: AdminUserSettings["id"]): Promise<void> {
    await this.adminUserSettingsModel.deleteOne({ _id: id });
  }
}
