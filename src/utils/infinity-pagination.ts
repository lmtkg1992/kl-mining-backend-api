import { IPaginationOptions } from "./types/pagination-options";
import { InfinityPaginationResponseDto } from "./dto/infinity-pagination-response.dto";

export const infinityPagination = <T>(
  list: T[],
  options: IPaginationOptions,
): InfinityPaginationResponseDto<T> => {
  return {
    list,
    hasNextPage: list.length === options.limit,
  };
};
