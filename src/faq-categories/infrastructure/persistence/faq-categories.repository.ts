import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { FaqCategories } from "../../domain/faq-categories";

export abstract class FaqCategoriesRepository {
  abstract create(
    data: Omit<FaqCategories, "id" | "createdAt" | "updatedAt">,
  ): Promise<FaqCategories>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FaqCategories[]>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<FaqCategories[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(
    id: FaqCategories["id"],
  ): Promise<NullableType<FaqCategories>>;

  abstract findByIds(ids: FaqCategories["id"][]): Promise<FaqCategories[]>;

  abstract update(
    id: FaqCategories["id"],
    payload: DeepPartial<FaqCategories>,
  ): Promise<FaqCategories | null>;

  abstract remove(id: FaqCategories["id"]): Promise<void>;
}
