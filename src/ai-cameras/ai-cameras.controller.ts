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
import { AiCamerasService } from "./ai-cameras.service";
import { CreateAiCamerasDto } from "./dto/create-ai-cameras.dto";
import { UpdateAiCamerasDto } from "./dto/update-ai-cameras.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AiCameras } from "./domain/ai-cameras";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "../utils/infinity-pagination";
import { FindAllAiCamerasDto } from "./dto/find-all-ai-cameras.dto";

@ApiTags("Aicameras")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "ai-cameras",
  version: "1",
})
export class AiCamerasController {
  constructor(private readonly aiCamerasService: AiCamerasService) {}

  @Post()
  @ApiCreatedResponse({
    type: AiCameras,
  })
  create(@Body() createAiCamerasDto: CreateAiCamerasDto) {
    return this.aiCamerasService.create(createAiCamerasDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(AiCameras),
  })
  async findAll(
    @Query() query: FindAllAiCamerasDto,
  ): Promise<InfinityPaginationResponseDto<AiCameras>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.aiCamerasService.findAllWithPagination({
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
    type: AiCameras,
  })
  findById(@Param("id") id: string) {
    return this.aiCamerasService.findById(id);
  }

  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AiCameras,
  })
  update(
    @Param("id") id: string,
    @Body() updateAiCamerasDto: UpdateAiCamerasDto,
  ) {
    return this.aiCamerasService.update(id, updateAiCamerasDto);
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.aiCamerasService.remove(id);
  }
}
