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
import { FindAllMiningSitesDto } from "./dto/find-all-mining-sites.dto";
import { infinityPaginationWithMetadata } from "../utils/infinity-pagination-with-metadata";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { PermissionsGuard } from "src/common/guards/permissions.guard";

@ApiTags("Miningsites")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), PermissionsGuard)
@Controller({
  path: "mining-sites",
  version: "1",
})
export class MiningSitesController {
  constructor(private readonly miningSitesService: MiningSitesService) {}

  @RequirePermissions("mining_sites::create")
  @Post()
  @ApiCreatedResponse({
    type: MiningSites,
  })
  create(@Body() createMiningSitesDto: CreateMiningSitesDto) {
    return this.miningSitesService.create(createMiningSitesDto);
  }

  @RequirePermissions("mining_sites::list")
  @Get("list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(MiningSites),
  })
  async findAll(
    @Query() query: FindAllMiningSitesDto,
  ): Promise<InfinityPaginationResponseDto<MiningSites>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.miningSitesService.findAllWithFilterAndPagination(
      query,
      {
        page,
        limit,
      },
    );

    return infinityPaginationWithMetadata(data.entites, data.total, {
      page,
      limit,
    });
  }

  @RequirePermissions("mining_sites::detail")
  @Get("detail/:id")
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

  @RequirePermissions("mining_sites::update")
  @Patch("update/:id")
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

  @RequirePermissions("mining_sites::delete")
  @Delete("delete/:id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.miningSitesService.remove(id);
  }
}
