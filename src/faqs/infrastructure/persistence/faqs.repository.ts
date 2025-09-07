import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { Faqs } from "../../domain/faqs";

export abstract class FaqsRepository {
  abstract create(
    data: Omit<Faqs, "id" | "createdAt" | "updatedAt">,
  ): Promise<Faqs>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Faqs[]>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Faqs[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(id: Faqs["id"]): Promise<NullableType<Faqs>>;

  abstract findByIds(ids: Faqs["id"][]): Promise<Faqs[]>;

  abstract update(
    id: Faqs["id"],
    payload: DeepPartial<Faqs>,
  ): Promise<Faqs | null>;

  abstract remove(id: Faqs["id"]): Promise<void>;
}
