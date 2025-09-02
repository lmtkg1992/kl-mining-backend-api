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

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(AiSnapshots),
  })
  async findAll(
    @Query() query: FindAllAiSnapshotsDto,
  ): Promise<InfinityPaginationResponseDto<AiSnapshots>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.aiSnapshotsService.findAllWithPagination({
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
    type: AiSnapshots,
  })
  findById(@Param("id") id: string) {
    return this.aiSnapshotsService.findById(id);
  }

  @Patch(":id")
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

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.aiSnapshotsService.remove(id);
  }
}
