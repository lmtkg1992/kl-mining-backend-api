import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AiCamerasSchemaClass } from "../entities/ai-cameras.schema";
import { AiCamerasRepository } from "../../ai-cameras.repository";
import { AiCameras } from "../../../../domain/ai-cameras";
import { AiCamerasMapper } from "../mappers/ai-cameras.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class AiCamerasDocumentRepository implements AiCamerasRepository {
  constructor(
    @InjectModel(AiCamerasSchemaClass.name)
    private readonly aiCamerasModel: Model<AiCamerasSchemaClass>,
  ) {}

  async create(data: AiCameras): Promise<AiCameras> {
    const persistenceModel = AiCamerasMapper.toPersistence(data);
    const createdEntity = new this.aiCamerasModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return AiCamerasMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AiCameras[]> {
    const entityObjects = await this.aiCamerasModel
      .find()
      .populate({
        path: "site_id",
      })
      .sort({ createdAt: -1 })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .lean();

    return entityObjects.map((entityObject) =>
      AiCamerasMapper.toDomain(entityObject),
    );
  }

  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<AiCameras[]> {
    const entityObjects = await this.aiCamerasModel
      .find(filter)
      .populate({
        path: "site_id",
      })
      .sort({ createdAt: -1 })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .lean();

    return entityObjects.map((entityObject) =>
      AiCamerasMapper.toDomain(entityObject),
    );
  }

  async countWithFilter(filter: any): Promise<number> {
    return this.aiCamerasModel.countDocuments(filter);
  }

  async findById(id: AiCameras["id"]): Promise<NullableType<AiCameras>> {
    const entityObject = await this.aiCamerasModel
      .findById(id)
      .populate({
        path: "site_id",
      })
      .lean();
    return entityObject ? AiCamerasMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: AiCameras["id"][]): Promise<AiCameras[]> {
    const entityObjects = await this.aiCamerasModel
      .find({ _id: { $in: ids } })
      .populate({
        path: "site_id",
      })
      .lean();
    return entityObjects.map((entityObject) =>
      AiCamerasMapper.toDomain(entityObject),
    );
  }

  async update(
    id: AiCameras["id"],
    payload: Partial<AiCameras>,
  ): Promise<NullableType<AiCameras>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.aiCamerasModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.aiCamerasModel.findOneAndUpdate(
      filter,
      AiCamerasMapper.toPersistence({
        ...AiCamerasMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? AiCamerasMapper.toDomain(entityObject) : null;
  }

  async remove(id: AiCameras["id"]): Promise<void> {
    await this.aiCamerasModel.deleteOne({ _id: id });
  }
}
