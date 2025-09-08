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
import { FaqCategoriesService } from "./faq-categories.service";
import { CreateFaqCategoriesDto } from "./dto/create-faq-categories.dto";
import { UpdateFaqCategoriesDto } from "./dto/update-faq-categories.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { FaqCategories } from "./domain/faq-categories";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { FindAllFaqCategoriesDto } from "./dto/find-all-faq-categories.dto";

import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { infinityPaginationWithMetadata } from "../utils/infinity-pagination-with-metadata";

@ApiTags("Faqcategories")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "faq-categories",
  version: "1",
})
export class FaqCategoriesController {
  constructor(private readonly faqCategoriesService: FaqCategoriesService) {}

  @RequirePermissions("faq-categories::create")
  @Post("create")
  @ApiCreatedResponse({
    type: FaqCategories,
  })
  create(@Body() createFaqCategoriesDto: CreateFaqCategoriesDto) {
    return this.faqCategoriesService.create(createFaqCategoriesDto);
  }

  @Get("list")
  @RequirePermissions("faq-categories::list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(FaqCategories),
  })
  async findAll(
    @Query() query: FindAllFaqCategoriesDto,
  ): Promise<InfinityPaginationResponseDto<FaqCategories>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.faqCategoriesService.findAllWithFilterAndPagination(
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
  @RequirePermissions("faq-categories::list")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: FaqCategories,
  })
  findById(@Param("id") id: string) {
    return this.faqCategoriesService.findById(id);
  }

  @Patch("update/:id")
  @RequirePermissions("faq-categories::update")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: FaqCategories,
  })
  update(
    @Param("id") id: string,
    @Body() updateFaqCategoriesDto: UpdateFaqCategoriesDto,
  ) {
    return this.faqCategoriesService.update(id, updateFaqCategoriesDto);
  }

  @Delete("delete/:id")
  @RequirePermissions("faq-categories::delete")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.faqCategoriesService.remove(id);
  }
}
