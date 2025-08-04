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
import { ProvincesService } from "./provinces.service";
import { CreateProvincesDto } from "./dto/create-provinces.dto";
import { UpdateProvincesDto } from "./dto/update-provinces.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Provinces } from "./domain/provinces";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "../utils/infinity-pagination";
import { FindAllProvincesDto } from "./dto/find-all-provinces.dto";

@ApiTags("Provinces")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "provinces",
  version: "1",
})
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Provinces,
  })
  create(@Body() createProvincesDto: CreateProvincesDto) {
    return this.provincesService.create(createProvincesDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Provinces),
  })
  async findAll(
    @Query() query: FindAllProvincesDto,
  ): Promise<InfinityPaginationResponseDto<Provinces>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.provincesService.findAllWithPagination({
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
    type: Provinces,
  })
  findById(@Param("id") id: string) {
    return this.provincesService.findById(id);
  }

  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Provinces,
  })
  update(
    @Param("id") id: string,
    @Body() updateProvincesDto: UpdateProvincesDto,
  ) {
    return this.provincesService.update(id, updateProvincesDto);
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.provincesService.remove(id);
  }
}
