import { IPaginationOptions } from "./types/pagination-options";
import {
  InfinityResponseDto,
  InfinityPaginationResponseWithMetadataDto,
} from "./dto/infinity-pagination-response.dto";

export const infinityPaginationWithMetadata = <T>(
  list: T[],
  total: number,
  options: IPaginationOptions,
): InfinityPaginationResponseWithMetadataDto<T> => {
  return {
    total,
    page: options.page,
    limit: options.limit,
    list,
  };
};

export const infinity = <T>(list: T[]): InfinityResponseDto<T> => {
  return {
    list,
  };
};
