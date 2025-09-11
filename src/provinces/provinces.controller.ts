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
import { infinityPaginationWithMetadata } from "../utils/infinity-pagination-with-metadata";
import { FindAllProvincesDto } from "./dto/find-all-provinces.dto";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { AiCameras } from "../ai-cameras/domain/ai-cameras";
import { FindAllAiCamerasDto } from "../ai-cameras/dto/find-all-ai-cameras.dto";
import { ProvincesMaterialsResponseDto } from "./dto/provinces-materials-response.dto";
import { ProvincesStatisticsResponseDto } from "./dto/provinces-statistics-response.dto";
import { FindStatisticsDto } from "./dto/find-statistics.dto";
import { FindAllMiningSitesDto } from "../mining-sites/dto/find-all-mining-sites.dto";
import { MiningSites } from "../mining-sites/domain/mining-sites";
import { MiningSitesService } from "../mining-sites/mining-sites.service";
import { Alerts } from "../alerts/domain/alerts";
import { FindAllAlertsDto } from "../alerts/dto/find-all-alerts.dto";
import { AlertSummaryDto } from "../alerts/dto/alert-summary.dto";

@ApiTags("Provinces")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), PermissionsGuard)
@Controller({
  path: "provinces",
  version: "1",
})
export class ProvincesController {
  constructor(
    private readonly provincesService: ProvincesService,
    private readonly miningSitesService: MiningSitesService,
  ) {}

  @RequirePermissions("provinces::create")
  @Post()
  @ApiCreatedResponse({
    type: Provinces,
  })
  create(@Body() createProvincesDto: CreateProvincesDto) {
    return this.provincesService.create(createProvincesDto);
  }

  @RequirePermissions("provinces::list")
  @Get("list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(Provinces),
  })
  async findAll(
    @Query() query: FindAllProvincesDto,
  ): Promise<InfinityPaginationResponseDto<Provinces>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.provincesService.findAllWithFilterAndPagination(
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

  @RequirePermissions("provinces::detail")
  @Get("detail/:id")
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

  @RequirePermissions("provinces::update")
  @Patch("update/:id")
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

  @RequirePermissions("provinces::delete")
  @Delete("delete/:id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.provincesService.remove(id);
  }

  @RequirePermissions("provinces::statistics")
  @Get("statistics/:id")
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOkResponse({ type: ProvincesStatisticsResponseDto })
  async getStatistics(
    @Param("id") id: string,
    @Query() query: FindStatisticsDto,
  ) {
    return this.provincesService.getStatistics(id, query);
  }

  @RequirePermissions("provinces::ai_cameras::list")
  @Get("ai-cameras/list/:id")
  @ApiOkResponse({ type: InfinityPaginationResponse(AiCameras) })
  async getLiveAiCameras(
    @Param("id") id: string,
    @Query() query: FindAllAiCamerasDto,
  ): Promise<InfinityPaginationResponseDto<AiCameras>> {
    let page = query?.page ?? 1;
    if (page < 1) page = 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    query.province_id = id;

    const data = await this.provincesService.getLiveAiCameras(query, {
      page,
      limit,
    });

    return infinityPaginationWithMetadata(data.entities, data.total, {
      page,
      limit,
    });
  }

  @RequirePermissions("provinces::mining_sites::list")
  @Get("mining-sites/list/:id")
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOkResponse({
    type: InfinityPaginationResponse(MiningSites),
  })
  async getMiningSites(
    @Param("id") id: string,
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

    query.province_id = id;

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

  @RequirePermissions("provinces::materials")
  @Get("materials/:id")
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOkResponse({ type: ProvincesMaterialsResponseDto })
  async getMaterials(@Param("id") id: string) {
    return this.provincesService.getMaterials(id);
  }


  @RequirePermissions("provinces::alerts")
  @Get("alerts/:id")
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOkResponse({ type: InfinityPaginationResponse(Alerts) })
  async getAlerts(@Param("id") id: string, @Query() query: FindAllAlertsDto) {
    
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    query.province_id = id;

    const data = await this.provincesService.getAlerts(id, query, {
      page,
      limit,
    });
    return infinityPaginationWithMetadata(data.entities, data.total, {
      page,
      limit,
    });
  }

  @RequirePermissions("provinces::alerts::summary")
  @Get("alerts-summary/:id")
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOkResponse({ type: AlertSummaryDto })
  async getAlertSummary(@Param("id") id: string) {
    return this.provincesService.getAlertSummary(id);
  }
}
