import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { MiningSites } from "../../domain/mining-sites";

export abstract class MiningSitesRepository {
  abstract create(
    data: Omit<MiningSites, "id" | "createdAt" | "updatedAt">,
  ): Promise<MiningSites>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<MiningSites[]>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<MiningSites[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(id: MiningSites["id"]): Promise<NullableType<MiningSites>>;

  abstract findByIds(ids: MiningSites["id"][]): Promise<MiningSites[]>;

  abstract update(
    id: MiningSites["id"],
    payload: DeepPartial<MiningSites>,
  ): Promise<MiningSites | null>;

  abstract remove(id: MiningSites["id"]): Promise<void>;
}
