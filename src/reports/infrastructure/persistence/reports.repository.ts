import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { Reports } from "../../domain/reports";
import { ReportSummaryDto } from "../../dto/report-summary.dto";

export abstract class ReportsRepository {
  abstract create(
    data: Omit<Reports, "id" | "createdAt" | "updatedAt">,
  ): Promise<Reports>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Reports[]>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Reports[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(id: Reports["id"]): Promise<NullableType<Reports>>;

  abstract findByIds(ids: Reports["id"][]): Promise<Reports[]>;

  abstract update(
    id: Reports["id"],
    payload: DeepPartial<Reports>,
  ): Promise<Reports | null>;

  abstract remove(id: Reports["id"]): Promise<void>;

  abstract getReportSummary(
    type: string,
    id?: string,
  ): Promise<ReportSummaryDto>;
}
