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
import { AlertsService } from "./alerts.service";
import { CreateAlertsDto } from "./dto/create-alerts.dto";
import { UpdateAlertsDto } from "./dto/update-alerts.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Alerts } from "./domain/alerts";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { FindAllAlertsDto } from "./dto/find-all-alerts.dto";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { infinityPaginationWithMetadata } from "src/utils/infinity-pagination-with-metadata";

@ApiTags("Alerts")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "alerts",
  version: "1",
})
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Alerts,
  })
  create(@Body() createAlertsDto: CreateAlertsDto) {
    return this.alertsService.create(createAlertsDto);
  }

  @Get('list')
  @RequirePermissions("alerts::list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(Alerts),
  })
  async findAll(
    @Query() query: FindAllAlertsDto,
  ): Promise<InfinityPaginationResponseDto<Alerts>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.alertsService.findAllWithFilterAndPagination(
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
  @RequirePermissions("alerts::detail")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Alerts,
  })
  findById(@Param("id") id: string) {
    return this.alertsService.findById(id);
  }

  @Patch("update/:id")
  @RequirePermissions("alerts::update")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Alerts,
  })
  update(@Param("id") id: string, @Body() updateAlertsDto: UpdateAlertsDto) {
    return this.alertsService.update(id, updateAlertsDto);
  }

  @Delete("delete/:id")
  @RequirePermissions("alerts::delete")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.alertsService.remove(id);
  }
}
