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

  abstract getBreachAlertSummary(level:string, id?: string[]): Promise<{
    total_alerts: number;
    critical_alerts: number;
    high_confidence_alerts: number;
    acknowledged_resolved: number;
  }>;

  abstract getTruckActivitiesSummary(level:string, id?: string[]): Promise<{
    trucks_in: number;
    trucks_out: number;
    truck_in_activities: number;
    truck_overloaded: number;
  }>;
}
