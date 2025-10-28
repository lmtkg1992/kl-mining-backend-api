import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { AiSnapshots } from "../../domain/ai-snapshots";

export abstract class AiSnapshotsRepository {
  abstract create(
    data: Omit<AiSnapshots, "id" | "createdAt" | "updatedAt">,
  ): Promise<AiSnapshots>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AiSnapshots[]>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<AiSnapshots[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(id: AiSnapshots["id"]): Promise<NullableType<AiSnapshots>>;

  abstract findByIds(ids: AiSnapshots["id"][]): Promise<AiSnapshots[]>;

  abstract findByEventId(eventId: string): Promise<NullableType<AiSnapshots>>;

  abstract update(
    id: AiSnapshots["id"],
    payload: DeepPartial<AiSnapshots>,
  ): Promise<AiSnapshots | null>;

  abstract remove(id: AiSnapshots["id"]): Promise<void>;
}
