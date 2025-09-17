import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ReportsSchemaClass } from "../entities/reports.schema";
import { ReportsRepository } from "../../reports.repository";
import { Reports } from "../../../../domain/reports";
import { ReportsMapper } from "../mappers/reports.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";
import { ReportSummaryDto } from "src/reports/dto/report-summary.dto";

@Injectable()
export class ReportsDocumentRepository implements ReportsRepository {
  constructor(
    @InjectModel(ReportsSchemaClass.name)
    private readonly reportsModel: Model<ReportsSchemaClass>,
  ) {}

  async create(data: Reports): Promise<Reports> {
    const persistenceModel = ReportsMapper.toPersistence(data);
    const createdEntity = new this.reportsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return ReportsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Reports[]> {
    const entityObjects = await this.reportsModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      ReportsMapper.toDomain(entityObject),
    );
  }

  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Reports[]> {
    const entityObjects = await this.reportsModel
      .find(filter)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      ReportsMapper.toDomain(entityObject),
    );
  }

  async countWithFilter(filter: any): Promise<number> {
    return this.reportsModel.countDocuments(filter);
  }

  async findById(id: Reports["id"]): Promise<NullableType<Reports>> {
    const entityObject = await this.reportsModel.findById(id);
    return entityObject ? ReportsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Reports["id"][]): Promise<Reports[]> {
    const entityObjects = await this.reportsModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      ReportsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Reports["id"],
    payload: Partial<Reports>,
  ): Promise<NullableType<Reports>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.reportsModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.reportsModel.findOneAndUpdate(
      filter,
      ReportsMapper.toPersistence({
        ...ReportsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? ReportsMapper.toDomain(entityObject) : null;
  }

  async remove(id: Reports["id"]): Promise<void> {
    await this.reportsModel.deleteOne({ _id: id });
  }

  async getReportSummary(type: string, id: string): Promise<ReportSummaryDto> {
    let totalReports = 0;
    let pendingReports = 0;
    let completedTodayReports = 0;
    let failedReports = 0;
    if (type === "site") {
      totalReports = await this.reportsModel.countDocuments({
        site_id: id,
      });
      pendingReports = await this.reportsModel.countDocuments({
        site_id: id,
        status: "pending",
      });
      completedTodayReports = await this.reportsModel.countDocuments({
        site_id: id,
        status: "completed",
      });
      failedReports = await this.reportsModel.countDocuments({
        site_id: id,
        status: "failed",
      });
    } else if (type === "province") {
      totalReports = await this.reportsModel.countDocuments({
        province_id: id,
      });
      pendingReports = await this.reportsModel.countDocuments({
        province_id: id,
        status: "pending",
      });
      completedTodayReports = await this.reportsModel.countDocuments({
        province_id: id,
        status: "completed",
      });
      failedReports = await this.reportsModel.countDocuments({
        province_id: id,
        status: "failed",
      });
    } else if (type === "admin") {
      totalReports = await this.reportsModel.countDocuments({
        generated_by: id,
      });
      pendingReports = await this.reportsModel.countDocuments({
        generated_by: id,
        status: "pending",
      });
      completedTodayReports = await this.reportsModel.countDocuments({
        generated_by: id,
        status: "completed",
      });
      failedReports = await this.reportsModel.countDocuments({
        generated_by: id,
        status: "failed",
      });
    }
    return {
      total_reports: totalReports,
      pending: pendingReports,
      completed_today: completedTodayReports,
      failed: failedReports,
    };
  }
}
