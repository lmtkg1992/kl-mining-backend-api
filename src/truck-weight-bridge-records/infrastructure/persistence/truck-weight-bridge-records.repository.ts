import { DeepPartial } from "../../../utils/types/deep-partial.type";
import { NullableType } from "../../../utils/types/nullable.type";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { TruckWeightBridgeRecords } from "../../domain/truck-weight-bridge-records";

export abstract class TruckWeightBridgeRecordsRepository {
  abstract create(
    data: Omit<TruckWeightBridgeRecords, "id" | "createdAt" | "updatedAt">,
  ): Promise<TruckWeightBridgeRecords>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<TruckWeightBridgeRecords[]>;

  abstract findById(
    id: TruckWeightBridgeRecords["id"],
  ): Promise<NullableType<TruckWeightBridgeRecords>>;

  abstract findByIds(
    ids: TruckWeightBridgeRecords["id"][],
  ): Promise<TruckWeightBridgeRecords[]>;

  abstract update(
    id: TruckWeightBridgeRecords["id"],
    payload: DeepPartial<TruckWeightBridgeRecords>,
  ): Promise<TruckWeightBridgeRecords | null>;

  abstract remove(id: TruckWeightBridgeRecords["id"]): Promise<void>;
}
