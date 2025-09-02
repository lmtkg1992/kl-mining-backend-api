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
import { AiSnapshotsService } from "./ai-snapshots.service";
import { CreateAiSnapshotsDto } from "./dto/create-ai-snapshots.dto";
import { UpdateAiSnapshotsDto } from "./dto/update-ai-snapshots.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AiSnapshots } from "./domain/ai-snapshots";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "../utils/infinity-pagination";
import { FindAllAiSnapshotsDto } from "./dto/find-all-ai-snapshots.dto";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { infinityPaginationWithMetadata } from "../utils/infinity-pagination-with-metadata";

@ApiTags("Aisnapshots")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "ai-snapshots",
  version: "1",
})
export class AiSnapshotsController {
  constructor(private readonly aiSnapshotsService: AiSnapshotsService) {}

  @Post()
  @ApiCreatedResponse({
    type: AiSnapshots,
  })
  create(@Body() createAiSnapshotsDto: CreateAiSnapshotsDto) {
    return this.aiSnapshotsService.create(createAiSnapshotsDto);
  }

  @RequirePermissions("ai_snapshots::list")
  @Get("list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(AiSnapshots),
  })
  async findAll(
    @Query() query: FindAllAiSnapshotsDto,
  ): Promise<InfinityPaginationResponseDto<AiSnapshots>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.aiSnapshotsService.findAllWithFilterAndPagination(
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

  @RequirePermissions("ai_snapshots::detail")
  @Get("detail/:id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AiSnapshots,
  })
  findById(@Param("id") id: string) {
    return this.aiSnapshotsService.findById(id);
  }

  @RequirePermissions("ai_snapshots::update")
  @Patch("update/:id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AiSnapshots,
  })
  update(
    @Param("id") id: string,
    @Body() updateAiSnapshotsDto: UpdateAiSnapshotsDto,
  ) {
    return this.aiSnapshotsService.update(id, updateAiSnapshotsDto);
  }

  @RequirePermissions("ai_snapshots::delete")
  @Delete("delete/:id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.aiSnapshotsService.remove(id);
  }
}
