import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { Trucks } from "../../domain/trucks";

export abstract class TrucksRepository {
  abstract create(
    data: Omit<Trucks, "id" | "createdAt" | "updatedAt">,
  ): Promise<Trucks>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Trucks[]>;

  abstract findById(id: Trucks["id"]): Promise<NullableType<Trucks>>;

  abstract findByIds(ids: Trucks["id"][]): Promise<Trucks[]>;

  abstract update(
    id: Trucks["id"],
    payload: DeepPartial<Trucks>,
  ): Promise<Trucks | null>;

  abstract remove(id: Trucks["id"]): Promise<void>;
}
