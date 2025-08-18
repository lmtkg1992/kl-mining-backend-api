import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MiningSitesSchemaClass } from "../entities/mining-sites.schema";
import { MiningSitesRepository } from "../../mining-sites.repository";
import { MiningSites } from "../../../../domain/mining-sites";
import { MiningSitesMapper } from "../mappers/mining-sites.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class MiningSitesDocumentRepository implements MiningSitesRepository {
  constructor(
    @InjectModel(MiningSitesSchemaClass.name)
    private readonly miningSitesModel: Model<MiningSitesSchemaClass>,
  ) {}

  async create(data: MiningSites): Promise<MiningSites> {
    const persistenceModel = MiningSitesMapper.toPersistence(data);
    const createdEntity = new this.miningSitesModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return MiningSitesMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<MiningSites[]> {
    const entityObjects = await this.miningSitesModel
      .find()
      .populate({
        path: "province",
      })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .lean();

    return entityObjects.map((entityObject) =>
      MiningSitesMapper.toDomain(entityObject),
    );
  }

  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<MiningSites[]> {
    const entityObjects = await this.miningSitesModel
      .find(filter)
      .populate({
        path: "province",
      })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .lean();

    return entityObjects.map((entityObject) =>
      MiningSitesMapper.toDomain(entityObject),
    );
  }

  async countWithFilter(filter: any): Promise<number> {
    return this.miningSitesModel.countDocuments(filter);
  }

  async findById(id: MiningSites["id"]): Promise<NullableType<MiningSites>> {
    const entityObject = await this.miningSitesModel
      .findById(id)
      .populate({
        path: "province",
      })
      .lean();
    return entityObject ? MiningSitesMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: MiningSites["id"][]): Promise<MiningSites[]> {
    const entityObjects = await this.miningSitesModel
      .find({
        _id: { $in: ids },
      })
      .populate({
        path: "province",
      })
      .lean();
    return entityObjects.map((entityObject) =>
      MiningSitesMapper.toDomain(entityObject),
    );
  }

  async update(
    id: MiningSites["id"],
    payload: Partial<MiningSites>,
  ): Promise<NullableType<MiningSites>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.miningSitesModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.miningSitesModel.findOneAndUpdate(
      filter,
      MiningSitesMapper.toPersistence({
        ...MiningSitesMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? MiningSitesMapper.toDomain(entityObject) : null;
  }

  async remove(id: MiningSites["id"]): Promise<void> {
    await this.miningSitesModel.deleteOne({ _id: id });
  }
}
