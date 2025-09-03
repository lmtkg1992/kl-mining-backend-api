import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { Alerts } from "../../domain/alerts";

export abstract class AlertsRepository {
  abstract create(
    data: Omit<Alerts, "id" | "createdAt" | "updatedAt">,
  ): Promise<Alerts>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Alerts[]>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Alerts[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(id: Alerts["id"]): Promise<NullableType<Alerts>>;

  abstract findByIds(ids: Alerts["id"][]): Promise<Alerts[]>;

  abstract update(
    id: Alerts["id"],
    payload: DeepPartial<Alerts>,
  ): Promise<Alerts | null>;

  abstract remove(id: Alerts["id"]): Promise<void>;
}
