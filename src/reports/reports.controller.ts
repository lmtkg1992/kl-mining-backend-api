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
import { ReportsService } from "./reports.service";
import { CreateReportsDto } from "./dto/create-reports.dto";
import { UpdateReportsDto } from "./dto/update-reports.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Reports } from "./domain/reports";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { FindAllReportsDto } from "./dto/find-all-reports.dto";

import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { infinityPaginationWithMetadata } from "../utils/infinity-pagination-with-metadata";

@ApiTags("Reports")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "reports",
  version: "1",
})
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @RequirePermissions("reports::create")
  @Post("create")
  @ApiCreatedResponse({
    type: Reports,
  })
  create(@Body() createReportsDto: CreateReportsDto) {
    return this.reportsService.create(createReportsDto);
  }

  @Get("list")
  @RequirePermissions("reports::list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(Reports),
  })
  async findAll(
    @Query() query: FindAllReportsDto,
  ): Promise<InfinityPaginationResponseDto<Reports>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.reportsService.findAllWithFilterAndPagination(
      query,
      {
        page,
        limit,
      },
    );

    return infinityPaginationWithMetadata(data.entities, data.total, {
      page,
      limit,
    });
  }

  @Get("detail/:id")
  @RequirePermissions("reports::list")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Reports,
  })
  findById(@Param("id") id: string) {
    return this.reportsService.findById(id);
  }

  @Patch("update/:id")
  @RequirePermissions("reports::update")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Reports,
  })
  update(@Param("id") id: string, @Body() updateReportsDto: UpdateReportsDto) {
    return this.reportsService.update(id, updateReportsDto);
  }

  @Delete("delete/:id")
  @RequirePermissions("reports::delete")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.reportsService.remove(id);
  }
}
