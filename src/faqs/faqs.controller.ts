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
import { FaqsService } from "./faqs.service";
import { CreateFaqsDto } from "./dto/create-faqs.dto";
import { UpdateFaqsDto } from "./dto/update-faqs.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Faqs } from "./domain/faqs";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { FindAllFaqsDto } from "./dto/find-all-faqs.dto";
import { infinityPaginationWithMetadata } from "src/utils/infinity-pagination-with-metadata";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator";

@ApiTags("Faqs")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "faqs",
  version: "1",
})
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Post("create")
  @ApiCreatedResponse({
    type: Faqs,
  })
  create(@Body() createFaqsDto: CreateFaqsDto) {
    return this.faqsService.create(createFaqsDto);
  }

  @Get("list")
  @RequirePermissions("faqs::list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(Faqs),
  })
  async findAll(
    @Query() query: FindAllFaqsDto,
  ): Promise<InfinityPaginationResponseDto<Faqs>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    const data = await this.faqsService.findAllWithFilterAndPagination(query, {
      page,
      limit,
    });

    return infinityPaginationWithMetadata(data.entities, data.total, {
      page,
      limit,
    });
  }

  @Get("detail/:id")
  @RequirePermissions("faqs::detail")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Faqs,
  })
  findById(@Param("id") id: string) {
    return this.faqsService.findById(id);
  }

  @Patch("update/:id")
  @RequirePermissions("faqs::update")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Faqs,
  })
  update(@Param("id") id: string, @Body() updateFaqsDto: UpdateFaqsDto) {
    return this.faqsService.update(id, updateFaqsDto);
  }

  @Delete("delete/:id")
  @RequirePermissions("faqs::delete")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.faqsService.remove(id);
  }
}
