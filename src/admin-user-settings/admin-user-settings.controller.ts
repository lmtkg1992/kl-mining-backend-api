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
import { AdminUserSettingsService } from "./admin-user-settings.service";
import { CreateAdminUserSettingsDto } from "./dto/create-admin-user-settings.dto";
import { UpdateAdminUserSettingsDto } from "./dto/update-admin-user-settings.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AdminUserSettings } from "./domain/admin-user-settings";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { FindAllAdminUserSettingsDto } from "./dto/find-all-admin-user-settings.dto";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { infinityPaginationWithMetadata } from "../utils/infinity-pagination-with-metadata";

@ApiTags("Adminusersettings")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "admin-user-settings",
  version: "1",
})
export class AdminUserSettingsController {
  constructor(
    private readonly adminUserSettingsService: AdminUserSettingsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: AdminUserSettings,
  })
  create(@Body() createAdminUserSettingsDto: CreateAdminUserSettingsDto) {
    return this.adminUserSettingsService.create(createAdminUserSettingsDto);
  }

  @Get("list")
  @RequirePermissions("admin_user_settings::list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(AdminUserSettings),
  })
  async findAll(
    @Query() query: FindAllAdminUserSettingsDto,
  ): Promise<InfinityPaginationResponseDto<AdminUserSettings>> {
    let page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (page < 1) {
      page = 1;
    }
    if (limit > 50) {
      limit = 50;
    }

    const data =
      await this.adminUserSettingsService.findAllWithFilterAndPagination(
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
  @RequirePermissions("admin_user_settings::detail")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AdminUserSettings,
  })
  findById(@Param("id") id: string) {
    return this.adminUserSettingsService.findById(id);
  }

  @Patch("update/:id")
  @RequirePermissions("admin_user_settings::update")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AdminUserSettings,
  })
  update(
    @Param("id") id: string,
    @Body() updateAdminUserSettingsDto: UpdateAdminUserSettingsDto,
  ) {
    return this.adminUserSettingsService.update(id, updateAdminUserSettingsDto);
  }

  @Delete("delete/:id")
  @RequirePermissions("admin_user_settings::delete")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.adminUserSettingsService.remove(id);
  }
}
