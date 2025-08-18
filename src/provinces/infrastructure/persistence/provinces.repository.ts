import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { Provinces } from "../../domain/provinces";

export abstract class ProvincesRepository {
  abstract create(
    data: Omit<Provinces, "id" | "createdAt" | "updatedAt">,
  ): Promise<Provinces>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Provinces[]>;

  abstract findAllWithFilterAndPagination({
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Provinces[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(id: Provinces["id"]): Promise<NullableType<Provinces>>;

  abstract findByIds(ids: Provinces["id"][]): Promise<Provinces[]>;

  abstract update(
    id: Provinces["id"],
    payload: DeepPartial<Provinces>,
  ): Promise<Provinces | null>;

  abstract remove(id: Provinces["id"]): Promise<void>;
}
