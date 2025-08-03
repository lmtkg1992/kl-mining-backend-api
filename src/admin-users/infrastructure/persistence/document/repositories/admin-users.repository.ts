import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminUsersSchemaClass } from '../entities/admin-users.schema';
import { AdminUsersRepository } from '../../admin-users.repository';
import { AdminUsers } from '../../../../domain/admin-users';
import { AdminUsersMapper } from '../mappers/admin-users.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AdminUsersDocumentRepository implements AdminUsersRepository {
  constructor(
    @InjectModel(AdminUsersSchemaClass.name)
    private readonly adminUsersModel: Model<AdminUsersSchemaClass>,
  ) {}

  async create(data: AdminUsers): Promise<AdminUsers> {
    console.log('data repository', data);
    const persistenceModel = AdminUsersMapper.toPersistence(data);
    const createdEntity = new this.adminUsersModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return AdminUsersMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AdminUsers[]> {
    const entityObjects = await this.adminUsersModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      AdminUsersMapper.toDomain(entityObject),
    );
  }

  async findById(id: AdminUsers['id']): Promise<NullableType<AdminUsers>> {
    const entityObject = await this.adminUsersModel.findById(id);
    return entityObject ? AdminUsersMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: AdminUsers['id'][]): Promise<AdminUsers[]> {
    const entityObjects = await this.adminUsersModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      AdminUsersMapper.toDomain(entityObject),
    );
  }

  async findByUsername(username: string): Promise<NullableType<AdminUsers>> {
    const entityObject = await this.adminUsersModel.findOne({
      userName: username,
    });
    return entityObject ? AdminUsersMapper.toDomain(entityObject) : null;
  }

  async update(
    id: AdminUsers['id'],
    payload: Partial<AdminUsers>,
  ): Promise<NullableType<AdminUsers>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.adminUsersModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.adminUsersModel.findOneAndUpdate(
      filter,
      AdminUsersMapper.toPersistence({
        ...AdminUsersMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? AdminUsersMapper.toDomain(entityObject) : null;
  }

  async remove(id: AdminUsers['id']): Promise<void> {
    await this.adminUsersModel.deleteOne({ _id: id });
  }
}
