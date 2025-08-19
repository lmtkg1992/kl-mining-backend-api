import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  SerializeOptions,
  Request,
} from "@nestjs/common";
import { AdminUsersService } from "./admin-users.service";
import { CreateAdminUsersDto } from "./dto/create-admin-users.dto";
import { UpdateAdminUsersDto } from "./dto/update-admin-users.dto";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AdminUsers } from "./domain/admin-users";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { FindAllAdminUsersDto } from "./dto/find-all-admin-users.dto";
import { AuthGuard } from "@nestjs/passport";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AuthService } from "src/auth/auth.service";
import { NullableType } from "src/utils/types/nullable.type";
import { AdminLoginResponseDto } from "./dto/admin-login-response.dto";
import { AdminRefreshResponseDto } from "./dto/admin-refresh-response.dto";
import { infinityPaginationWithMetadata } from "src/utils/infinity-pagination-with-metadata";
import { RequirePermissions } from "src/common/decorators/require-permissions.decorator";

@ApiTags("Adminusers")
// @ApiBearerAuth()
// @UseGuards(AuthGuard("jwt"), PermissionsGuard)
@Controller({
  path: "admin-users",
  version: "1",
})
export class AdminUsersController {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly authService: AuthService,
  ) {}

  // Admin Users Auth
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AdminLoginResponseDto })
  public login(
    @Body() adminLoginDto: AdminLoginDto,
  ): Promise<AdminLoginResponseDto> {
    return this.adminUsersService.validateLogin(adminLoginDto);
  }

  @ApiBearerAuth()
  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  @ApiOkResponse({
    type: AdminUsers,
  })
  @HttpCode(HttpStatus.OK)
  public me(@Request() request): Promise<NullableType<AdminUsers>> {
    return this.adminUsersService.me(request.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: AdminRefreshResponseDto,
  })
  @SerializeOptions({
    groups: ["me"],
  })
  @Post("refresh")
  @UseGuards(AuthGuard("jwt-refresh"))
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request): Promise<AdminRefreshResponseDto> {
    return this.adminUsersService.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    });
  }

  @ApiBearerAuth()
  @Post("logout")
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request): Promise<void> {
    console.log(request.user);
    await this.authService.logout({
      sessionId: request.user.sessionId,
    });
  }

  // Admin Users CRUD
  @RequirePermissions("admin_users::create")
  @Post()
  @ApiCreatedResponse({
    type: AdminUsers,
  })
  create(@Body() createAdminUsersDto: CreateAdminUsersDto) {
    return this.adminUsersService.create(createAdminUsersDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RequirePermissions("admin_users::list")
  @Get("list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(AdminUsers),
  })
  async findAll(
    @Query() query: FindAllAdminUsersDto,
  ): Promise<InfinityPaginationResponseDto<AdminUsers>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.adminUsersService.findAllWithFilterAndPagination(
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RequirePermissions("admin_users::detail")
  @Get("detail/:id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AdminUsers,
  })
  findById(@Param("id") id: string) {
    return this.adminUsersService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RequirePermissions("admin_users::update")
  @Patch("update/:id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AdminUsers,
  })
  update(
    @Param("id") id: string,
    @Body() updateAdminUsersDto: UpdateAdminUsersDto,
  ) {
    return this.adminUsersService.update(id, updateAdminUsersDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RequirePermissions("admin_users::delete")
  @Delete("delete/:id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.adminUsersService.remove(id);
  }
}
