import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateTruckWeightBridgeRecordsDto } from "./dto/create-truck-weight-bridge-records.dto";
import { UpdateTruckWeightBridgeRecordsDto } from "./dto/update-truck-weight-bridge-records.dto";
import { TruckWeightBridgeRecordsRepository } from "./infrastructure/persistence/truck-weight-bridge-records.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { TruckWeightBridgeRecords } from "./domain/truck-weight-bridge-records";

@Injectable()
export class TruckWeightBridgeRecordsService {
  constructor(
    // Dependencies here
    private readonly truckWeightBridgeRecordsRepository: TruckWeightBridgeRecordsRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createTruckWeightBridgeRecordsDto: CreateTruckWeightBridgeRecordsDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.truckWeightBridgeRecordsRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.truckWeightBridgeRecordsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: TruckWeightBridgeRecords["id"]) {
    return this.truckWeightBridgeRecordsRepository.findById(id);
  }

  findByIds(ids: TruckWeightBridgeRecords["id"][]) {
    return this.truckWeightBridgeRecordsRepository.findByIds(ids);
  }

  async update(
    id: TruckWeightBridgeRecords["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateTruckWeightBridgeRecordsDto: UpdateTruckWeightBridgeRecordsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.truckWeightBridgeRecordsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: TruckWeightBridgeRecords["id"]) {
    return this.truckWeightBridgeRecordsRepository.remove(id);
  }
}
