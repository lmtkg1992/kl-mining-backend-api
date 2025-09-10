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
import { TrucksService } from "./trucks.service";
import { CreateTrucksDto } from "./dto/create-trucks.dto";
import { UpdateTrucksDto } from "./dto/update-trucks.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Trucks } from "./domain/trucks";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "../utils/infinity-pagination";
import { FindAllTrucksDto } from "./dto/find-all-trucks.dto";

import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { infinityPaginationWithMetadata } from "../utils/infinity-pagination-with-metadata";

@ApiTags("Trucks")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "trucks",
  version: "1",
})
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @RequirePermissions("trucks::create")
  @Post("create")
  @ApiCreatedResponse({
    type: Trucks,
  })
  create(@Body() createTrucksDto: CreateTrucksDto) {
    return this.trucksService.create(createTrucksDto);
  }

  @Get("list")
  @RequirePermissions("trucks::list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(Trucks),
  })
  async findAll(
    @Query() query: FindAllTrucksDto,
  ): Promise<InfinityPaginationResponseDto<Trucks>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.trucksService.findAllWithFilterAndPagination(
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

  @Get("detail/:id")
  @RequirePermissions("trucks::list")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Trucks,
  })
  findById(@Param("id") id: string) {
    return this.trucksService.findById(id);
  }

  @Patch("update/:id")
  @RequirePermissions("trucks::update")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Trucks,
  })
  update(@Param("id") id: string, @Body() updateTrucksDto: UpdateTrucksDto) {
    return this.trucksService.update(id, updateTrucksDto);
  }

  @Delete("delete/:id")
  @RequirePermissions("trucks::delete")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.trucksService.remove(id);
  }
}
