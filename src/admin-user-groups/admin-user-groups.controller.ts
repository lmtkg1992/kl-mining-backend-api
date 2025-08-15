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
import { AdminUserGroupsService } from "./admin-user-groups.service";
import { CreateAdminUserGroupsDto } from "./dto/create-admin-user-groups.dto";
import { UpdateAdminUserGroupsDto } from "./dto/update-admin-user-groups.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AdminUserGroups } from "./domain/admin-user-groups";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "../utils/infinity-pagination";
import { FindAllAdminUserGroupsDto } from "./dto/find-all-admin-user-groups.dto";

@ApiTags("Adminusergroups")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "admin-user-groups",
  version: "1",
})
export class AdminUserGroupsController {
  constructor(
    private readonly adminUserGroupsService: AdminUserGroupsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: AdminUserGroups,
  })
  create(@Body() createAdminUserGroupsDto: CreateAdminUserGroupsDto) {
    return this.adminUserGroupsService.create(createAdminUserGroupsDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(AdminUserGroups),
  })
  async findAll(
    @Query() query: FindAllAdminUserGroupsDto,
  ): Promise<InfinityPaginationResponseDto<AdminUserGroups>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.adminUserGroupsService.findAllWithPagination({
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
    type: AdminUserGroups,
  })
  findById(@Param("id") id: string) {
    return this.adminUserGroupsService.findById(id);
  }

  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AdminUserGroups,
  })
  update(
    @Param("id") id: string,
    @Body() updateAdminUserGroupsDto: UpdateAdminUserGroupsDto,
  ) {
    return this.adminUserGroupsService.update(id, updateAdminUserGroupsDto);
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.adminUserGroupsService.remove(id);
  }
}
