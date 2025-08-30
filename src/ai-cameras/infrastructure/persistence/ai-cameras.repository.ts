import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { AiCameras } from "../../domain/ai-cameras";

export abstract class AiCamerasRepository {
  abstract create(
    data: Omit<AiCameras, "id" | "createdAt" | "updatedAt">,
  ): Promise<AiCameras>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AiCameras[]>;

  abstract findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<AiCameras[]>;

  abstract countWithFilter(filter: any): Promise<number>;

  abstract findById(id: AiCameras["id"]): Promise<NullableType<AiCameras>>;

  abstract findByIds(ids: AiCameras["id"][]): Promise<AiCameras[]>;

  abstract update(
    id: AiCameras["id"],
    payload: DeepPartial<AiCameras>,
  ): Promise<AiCameras | null>;

  abstract remove(id: AiCameras["id"]): Promise<void>;
}
