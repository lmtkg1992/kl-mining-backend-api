import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { Personnel } from "../../domain/personnel";

export abstract class PersonnelRepository {
  abstract create(
    data: Omit<Personnel, "id" | "createdAt" | "updatedAt">,
  ): Promise<Personnel>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Personnel[]>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Personnel[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(id: Personnel["id"]): Promise<NullableType<Personnel>>;

  abstract findByIds(ids: Personnel["id"][]): Promise<Personnel[]>;

  abstract update(
    id: Personnel["id"],
    payload: DeepPartial<Personnel>,
  ): Promise<Personnel | null>;

  abstract remove(id: Personnel["id"]): Promise<void>;
}
