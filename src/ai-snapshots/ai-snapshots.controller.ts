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
  HttpCode,
  HttpStatus,
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
import { FindAllAiSnapshotsDto } from "./dto/find-all-ai-snapshots.dto";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { infinityPaginationWithMetadata } from "../utils/infinity-pagination-with-metadata";
import { IngestAiSnapshotDto } from "./dto/ingest-ai-snapshot.dto";
import { ReceiptResponseDto } from "./dto/receipt-response.dto";
import { FixedTokenGuard } from "./guards/fixed-token.guard";

@ApiTags("Aisnapshots")
@Controller({
  path: "ai-snapshots",
  version: "1",
})
export class AiSnapshotsController {
  constructor(private readonly aiSnapshotsService: AiSnapshotsService) {}

  // AI Provider endpoints - use FixedTokenGuard
  @Post()
  @UseGuards(FixedTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: "AI snapshot ingested successfully",
    schema: {
      type: "object",
      properties: {
        event_id: { type: "string" },
        status: { type: "string", enum: ["processing", "processed"] },
      },
    },
  })
  async handleIngestOrCreate(@Body() body: IngestAiSnapshotDto | CreateAiSnapshotsDto) {
    // Check if this is an AI provider ingestion request
    if (
      "event_id" in body &&
      "direction" in body &&
      !("camera_id" in body)
    ) {
      return this.aiSnapshotsService.ingestSnapshot(body as IngestAiSnapshotDto);
    }
    // Otherwise, use the standard create flow
    return this.aiSnapshotsService.create(body as CreateAiSnapshotsDto);
  }

  @Get("receipt/:event_id")
  @UseGuards(FixedTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiParam({
    name: "event_id",
    type: String,
    required: true,
    description: "AI System-provided unique ID",
  })
  @ApiOkResponse({
    type: ReceiptResponseDto,
  })
  async getReceiptStatus(@Param("event_id") eventId: string) {
    return this.aiSnapshotsService.getReceiptStatus(eventId);
  }

  // Admin endpoints - use JWT authentication
  @RequirePermissions("ai_snapshots::list")
  @Get("list")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
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

    return infinityPaginationWithMetadata(data.entities, data.total, {
      page,
      limit,
    });
  }

  @RequirePermissions("ai_snapshots::detail")
  @Get("detail/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.aiSnapshotsService.remove(id);
  }

}
