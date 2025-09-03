import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { TruckWeightBridgeRecordsService } from "./truck-weight-bridge-records.service";
import { CreateTruckWeightBridgeRecordsDto } from "./dto/create-truck-weight-bridge-records.dto";
import { UpdateTruckWeightBridgeRecordsDto } from "./dto/update-truck-weight-bridge-records.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { TruckWeightBridgeRecords } from "./domain/truck-weight-bridge-records";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "../utils/infinity-pagination";
import { FindAllTruckWeightBridgeRecordsDto } from "./dto/find-all-truck-weight-bridge-records.dto";

@ApiTags("Truckweightbridgerecords")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "truck-weight-bridge-records",
  version: "1",
})
export class TruckWeightBridgeRecordsController {
  constructor(
    private readonly truckWeightBridgeRecordsService: TruckWeightBridgeRecordsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: TruckWeightBridgeRecords,
  })
  create(
    @Body()
    createTruckWeightBridgeRecordsDto: CreateTruckWeightBridgeRecordsDto,
  ) {
    return this.truckWeightBridgeRecordsService.create(
      createTruckWeightBridgeRecordsDto,
    );
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(TruckWeightBridgeRecords),
  })
  async findAll(
    @Query() query: FindAllTruckWeightBridgeRecordsDto,
  ): Promise<InfinityPaginationResponseDto<TruckWeightBridgeRecords>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.truckWeightBridgeRecordsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: TruckWeightBridgeRecords,
  })
  findById(@Param("id") id: string) {
    return this.truckWeightBridgeRecordsService.findById(id);
  }

  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: TruckWeightBridgeRecords,
  })
  update(
    @Param("id") id: string,
    @Body()
    updateTruckWeightBridgeRecordsDto: UpdateTruckWeightBridgeRecordsDto,
  ) {
    return this.truckWeightBridgeRecordsService.update(
      id,
      updateTruckWeightBridgeRecordsDto,
    );
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.truckWeightBridgeRecordsService.remove(id);
  }
}
