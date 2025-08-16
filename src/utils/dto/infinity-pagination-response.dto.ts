import { Type } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class InfinityResponseDto<T> {
  list: T[];
}

export class InfinityPaginationResponseDto<T> extends InfinityResponseDto<T> {
  hasNextPage?: boolean;
}

export function InfinityPaginationResponse<T>(classReference: Type<T>) {
  abstract class Pagination {
    @ApiProperty({ type: [classReference] })
    list!: T[];

    @ApiProperty({
      type: Boolean,
      example: true,
    })
    hasNextPage: boolean;
  }

  Object.defineProperty(Pagination, "name", {
    writable: false,
    value: `InfinityPagination${classReference.name}ResponseDto`,
  });

  return Pagination;
}

export class InfinityPaginationResponseWithMetadataDto<
  T,
> extends InfinityResponseDto<T> {
  total: number;
  page: number;
  limit: number;
}
