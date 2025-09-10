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
import { ActivitiesService } from "./activities.service";
import { CreateActivitiesDto } from "./dto/create-activities.dto";
import { UpdateActivitiesDto } from "./dto/update-activities.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Activities } from "./domain/activities";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { FindAllActivitiesDto } from "./dto/find-all-activities.dto";

import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { infinityPaginationWithMetadata } from "../utils/infinity-pagination-with-metadata";

@ApiTags("Activities")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "activities",
  version: "1",
})
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @RequirePermissions("activities::create")
  @Post("create")
  @ApiCreatedResponse({
    type: Activities,
  })
  create(@Body() createActivitiesDto: CreateActivitiesDto) {
    return this.activitiesService.create(createActivitiesDto);
  }

  @Get("list")
  @RequirePermissions("activities::list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(Activities),
  })
  async findAll(
    @Query() query: FindAllActivitiesDto,
  ): Promise<InfinityPaginationResponseDto<Activities>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.activitiesService.findAllWithFilterAndPagination(
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
  @RequirePermissions("activities::list")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Activities,
  })
  findById(@Param("id") id: string) {
    return this.activitiesService.findById(id);
  }

  @Patch("update/:id")
  @RequirePermissions("activities::update")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Activities,
  })
  update(
    @Param("id") id: string,
    @Body() updateActivitiesDto: UpdateActivitiesDto,
  ) {
    return this.activitiesService.update(id, updateActivitiesDto);
  }

  @Delete("delete/:id")
  @RequirePermissions("activities::delete")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.activitiesService.remove(id);
  }
}
