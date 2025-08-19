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
import { FindAllAdminUserGroupsDto } from "./dto/find-all-admin-user-groups.dto";
import { infinityPaginationWithMetadata } from "src/utils/infinity-pagination-with-metadata";
import { PermissionsGuard } from "src/common/guards/permissions.guard";
import { RequirePermissions } from "src/common/decorators/require-permissions.decorator";

@ApiTags("Adminusergroups")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), PermissionsGuard)
@Controller({
  path: "admin-user-groups",
  version: "1",
})
export class AdminUserGroupsController {
  constructor(
    private readonly adminUserGroupsService: AdminUserGroupsService,
  ) {}

  @RequirePermissions("admin_user_groups::create")
  @Post()
  @ApiCreatedResponse({
    type: AdminUserGroups,
  })
  create(@Body() createAdminUserGroupsDto: CreateAdminUserGroupsDto) {
    return this.adminUserGroupsService.create(createAdminUserGroupsDto);
  }

  @RequirePermissions("admin_user_groups::list")
  @Get("list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(AdminUserGroups),
  })
  async findAll(
    @Query() query: FindAllAdminUserGroupsDto,
  ): Promise<InfinityPaginationResponseDto<AdminUserGroups>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data =
      await this.adminUserGroupsService.findAllWithFilterAndPagination(query, {
        page,
        limit,
      });

    return infinityPaginationWithMetadata(data.entites, data.total, {
      page,
      limit,
    });
  }

  @RequirePermissions("admin_user_groups::detail")
  @Get("detail/:id")
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

  @RequirePermissions("admin_user_groups::update")
  @Patch("update/:id")
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

  @RequirePermissions("admin_user_groups::delete")
  @Delete("delete/:id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.adminUserGroupsService.remove(id);
  }
}
