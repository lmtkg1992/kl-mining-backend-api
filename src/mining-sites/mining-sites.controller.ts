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
import { MiningSitesService } from "./mining-sites.service";
import { CreateMiningSitesDto } from "./dto/create-mining-sites.dto";
import { UpdateMiningSitesDto } from "./dto/update-mining-sites.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { MiningSites } from "./domain/mining-sites";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "../utils/infinity-pagination";
import { FindAllMiningSitesDto } from "./dto/find-all-mining-sites.dto";

@ApiTags("Miningsites")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "mining-sites",
  version: "1",
})
export class MiningSitesController {
  constructor(private readonly miningSitesService: MiningSitesService) {}

  @Post()
  @ApiCreatedResponse({
    type: MiningSites,
  })
  create(@Body() createMiningSitesDto: CreateMiningSitesDto) {
    return this.miningSitesService.create(createMiningSitesDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(MiningSites),
  })
  async findAll(
    @Query() query: FindAllMiningSitesDto,
  ): Promise<InfinityPaginationResponseDto<MiningSites>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.miningSitesService.findAllWithPagination({
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
    type: MiningSites,
  })
  findById(@Param("id") id: string) {
    return this.miningSitesService.findById(id);
  }

  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: MiningSites,
  })
  update(
    @Param("id") id: string,
    @Body() updateMiningSitesDto: UpdateMiningSitesDto,
  ) {
    return this.miningSitesService.update(id, updateMiningSitesDto);
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.miningSitesService.remove(id);
  }
}
