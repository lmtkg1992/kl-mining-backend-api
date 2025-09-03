import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { Notifications } from "../../domain/notifications";

export abstract class NotificationsRepository {
  abstract create(
    data: Omit<Notifications, "id" | "createdAt" | "updatedAt">,
  ): Promise<Notifications>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Notifications[]>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Notifications[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(
    id: Notifications["id"],
  ): Promise<NullableType<Notifications>>;

  abstract findByIds(ids: Notifications["id"][]): Promise<Notifications[]>;

  abstract update(
    id: Notifications["id"],
    payload: DeepPartial<Notifications>,
  ): Promise<Notifications | null>;

  abstract remove(id: Notifications["id"]): Promise<void>;
}
