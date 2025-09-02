import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AiSnapshotsSchemaClass } from "../entities/ai-snapshots.schema";
import { AiSnapshotsRepository } from "../../ai-snapshots.repository";
import { AiSnapshots } from "../../../../domain/ai-snapshots";
import { AiSnapshotsMapper } from "../mappers/ai-snapshots.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class AiSnapshotsDocumentRepository implements AiSnapshotsRepository {
  constructor(
    @InjectModel(AiSnapshotsSchemaClass.name)
    private readonly aiSnapshotsModel: Model<AiSnapshotsSchemaClass>,
  ) {}

  async create(data: AiSnapshots): Promise<AiSnapshots> {
    const persistenceModel = AiSnapshotsMapper.toPersistence(data);
    const createdEntity = new this.aiSnapshotsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return AiSnapshotsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AiSnapshots[]> {
    const entityObjects = await this.aiSnapshotsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      AiSnapshotsMapper.toDomain(entityObject),
    );
  }
  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<AiSnapshots[]> {
    const entityObjects = await this.aiSnapshotsModel
      .find(filter)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);
    return entityObjects.map((entityObject) =>
      AiSnapshotsMapper.toDomain(entityObject),
    );
  }

  async countWithFilter(filter: any): Promise<number> {
    return this.aiSnapshotsModel.countDocuments(filter);
  }

  async findById(id: AiSnapshots["id"]): Promise<NullableType<AiSnapshots>> {
    const entityObject = await this.aiSnapshotsModel.findById(id);
    return entityObject ? AiSnapshotsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: AiSnapshots["id"][]): Promise<AiSnapshots[]> {
    const entityObjects = await this.aiSnapshotsModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      AiSnapshotsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: AiSnapshots["id"],
    payload: Partial<AiSnapshots>,
  ): Promise<NullableType<AiSnapshots>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.aiSnapshotsModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.aiSnapshotsModel.findOneAndUpdate(
      filter,
      AiSnapshotsMapper.toPersistence({
        ...AiSnapshotsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? AiSnapshotsMapper.toDomain(entityObject) : null;
  }

  async remove(id: AiSnapshots["id"]): Promise<void> {
    await this.aiSnapshotsModel.deleteOne({ _id: id });
  }
}
