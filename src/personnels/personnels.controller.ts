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
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { PersonnelsService } from "./personnels.service";
import { CreatePersonnelDto } from "./dto/create-personnel.dto";
import { UpdatePersonnelDto } from "./dto/update-personnel.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { Personnel } from "./domain/personnel";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "../utils/infinity-pagination";
import { FindAllPersonnelsDto } from "./dto/find-all-personnels.dto";

import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { infinityPaginationWithMetadata } from "../utils/infinity-pagination-with-metadata";

@ApiTags("Personnels")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "personnels",
  version: "1",
})
export class PersonnelsController {
  constructor(private readonly personnelsService: PersonnelsService) {}

  @RequirePermissions("personnels::create")
  @Post("create")
  @ApiOperation({ summary: 'Create a new personnel record' })
  @ApiCreatedResponse({
    type: Personnel,
    description: 'Personnel record created successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed or referenced entities do not exist',
  })
  create(@Body() createPersonnelDto: CreatePersonnelDto) {
    return this.personnelsService.create(createPersonnelDto);
  }

  @Get("list")
  @RequirePermissions("personnels::list")
  @ApiOperation({ summary: 'Get paginated list of personnel with optional filtering' })
  @ApiOkResponse({
    type: InfinityPaginationResponse(Personnel),
    description: 'List of personnel records retrieved successfully',
  })
  async findAll(
    @Query() query: FindAllPersonnelsDto,
  ): Promise<InfinityPaginationResponseDto<Personnel>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.personnelsService.findAllWithFilterAndPagination(
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

  @Get("detail/:id")
  @RequirePermissions("personnels::list")
  @ApiOperation({ summary: 'Get personnel details by ID' })
  @ApiParam({
    name: "id",
    type: String,
    required: true,
    description: 'Personnel ID',
  })
  @ApiOkResponse({
    type: Personnel,
    description: 'Personnel details retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Personnel not found',
  })
  findById(@Param("id") id: string) {
    return this.personnelsService.findById(id);
  }

  @Patch("update/:id")
  @RequirePermissions("personnels::update")
  @ApiOperation({ summary: 'Update personnel record by ID' })
  @ApiParam({
    name: "id",
    type: String,
    required: true,
    description: 'Personnel ID',
  })
  @ApiOkResponse({
    type: Personnel,
    description: 'Personnel record updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Personnel not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed or referenced entities do not exist',
  })
  update(
    @Param("id") id: string,
    @Body() updatePersonnelDto: UpdatePersonnelDto,
  ) {
    return this.personnelsService.update(id, updatePersonnelDto);
  }

  @Delete("delete/:id")
  @RequirePermissions("personnels::delete")
  @ApiOperation({ summary: 'Delete personnel record by ID' })
  @ApiParam({
    name: "id",
    type: String,
    required: true,
    description: 'Personnel ID',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Personnel record deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Personnel not found',
  })
  remove(@Param("id") id: string) {
    return this.personnelsService.remove(id);
  }
}
