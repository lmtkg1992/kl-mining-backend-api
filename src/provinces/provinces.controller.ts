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
import { PermissionsGuard } from "src/common/guards/permissions.guard";
import { RequirePermissions } from "src/common/decorators/require-permissions.decorator";

@ApiTags("Provinces")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), PermissionsGuard)
@Controller({
  path: "provinces",
  version: "1",
})
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

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
}
