import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { AdminUserSettings } from "../../domain/admin-user-settings";

export abstract class AdminUserSettingsRepository {
  abstract create(
    data: Omit<AdminUserSettings, "id" | "createdAt" | "updatedAt">,
  ): Promise<AdminUserSettings>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AdminUserSettings[]>;

  abstract findById(
    id: AdminUserSettings["id"],
  ): Promise<NullableType<AdminUserSettings>>;

  abstract findByIds(
    ids: AdminUserSettings["id"][],
  ): Promise<AdminUserSettings[]>;

  abstract update(
    id: AdminUserSettings["id"],
    payload: DeepPartial<AdminUserSettings>,
  ): Promise<AdminUserSettings | null>;

  abstract remove(id: AdminUserSettings["id"]): Promise<void>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<AdminUserSettings[]>;

  abstract countWithFilter(filter: any): Promise<number>;
}
