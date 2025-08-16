import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { AdminUserGroups } from "../../domain/admin-user-groups";

export abstract class AdminUserGroupsRepository {
  abstract create(
    data: Omit<AdminUserGroups, "id" | "createdAt" | "updatedAt">,
  ): Promise<AdminUserGroups>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AdminUserGroups[]>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<AdminUserGroups[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(
    id: AdminUserGroups["id"],
  ): Promise<NullableType<AdminUserGroups>>;

  abstract findByIds(ids: AdminUserGroups["id"][]): Promise<AdminUserGroups[]>;

  abstract update(
    id: AdminUserGroups["id"],
    payload: DeepPartial<AdminUserGroups>,
  ): Promise<AdminUserGroups | null>;

  abstract remove(id: AdminUserGroups["id"]): Promise<void>;
}
