import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { AdminUsers } from "../../domain/admin-users";

export abstract class AdminUsersRepository {
  abstract create(
    data: Omit<AdminUsers, "id" | "createdAt" | "updatedAt">,
  ): Promise<AdminUsers>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AdminUsers[]>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<AdminUsers[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(id: AdminUsers["id"]): Promise<NullableType<AdminUsers>>;

  abstract findByIds(ids: AdminUsers["id"][]): Promise<AdminUsers[]>;

  abstract findByUsername(username: string): Promise<NullableType<AdminUsers>>;

  abstract findByEmail(email: string): Promise<NullableType<AdminUsers>>;

  abstract update(
    id: AdminUsers["id"],
    payload: DeepPartial<AdminUsers>,
  ): Promise<AdminUsers | null>;

  abstract remove(id: AdminUsers["id"]): Promise<void>;
}
