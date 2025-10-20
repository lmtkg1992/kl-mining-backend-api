import { Injectable, NotFoundException } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PersonnelSchemaClass } from "../entities/personnel.schema";
import { PersonnelRepository } from "../../personnel.repository";
import { Personnel } from "../../../../domain/personnel";
import { PersonnelMapper } from "../mappers/personnel.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class PersonnelDocumentRepository implements PersonnelRepository {
  constructor(
    @InjectModel(PersonnelSchemaClass.name)
    private readonly personnelModel: Model<PersonnelSchemaClass>,
  ) {}

  async create(data: Personnel): Promise<Personnel> {
    const persistenceModel = PersonnelMapper.toPersistence(data);
    const createdEntity = new this.personnelModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return PersonnelMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Personnel[]> {
    const entityObjects = await this.personnelModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      PersonnelMapper.toDomain(entityObject),
    );
  }

  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Personnel[]> {
    const entityObjects = await this.personnelModel
      .find(filter)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      PersonnelMapper.toDomain(entityObject),
    );
  }

  async countWithFilter(filter: any): Promise<number> {
    return this.personnelModel.countDocuments(filter);
  }

  async findById(id: Personnel["id"]): Promise<NullableType<Personnel>> {
    const entityObject = await this.personnelModel.findById(id);
    return entityObject ? PersonnelMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Personnel["id"][]): Promise<Personnel[]> {
    const entityObjects = await this.personnelModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      PersonnelMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Personnel["id"],
    payload: Partial<Personnel>,
  ): Promise<NullableType<Personnel>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.personnelModel.findOne(filter);

    if (!entity) {
      throw new NotFoundException(`Personnel with ID ${id} not found`);
    }

    const entityObject = await this.personnelModel.findOneAndUpdate(
      filter,
      PersonnelMapper.toPersistence({
        ...PersonnelMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? PersonnelMapper.toDomain(entityObject) : null;
  }

  async remove(id: Personnel["id"]): Promise<void> {
    const result = await this.personnelModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Personnel with ID ${id} not found`);
    }
  }
}
