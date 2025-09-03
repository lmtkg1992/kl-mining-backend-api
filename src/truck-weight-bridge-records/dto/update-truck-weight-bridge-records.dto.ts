// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateTruckWeightBridgeRecordsDto } from "./create-truck-weight-bridge-records.dto";

export class UpdateTruckWeightBridgeRecordsDto extends PartialType(
  CreateTruckWeightBridgeRecordsDto,
) {}
