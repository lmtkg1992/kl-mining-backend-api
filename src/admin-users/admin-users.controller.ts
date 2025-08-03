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
import { infinityPagination } from "../utils/infinity-pagination";
import { FindAllAdminUsersDto } from "./dto/find-all-admin-users.dto";
import { AuthGuard } from "@nestjs/passport";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AuthService } from "src/auth/auth.service";
import { NullableType } from "src/utils/types/nullable.type";
import { AdminLoginResponseDto } from "./dto/admin-login-response.dto";
import { AdminRefreshResponseDto } from "./dto/admin-refresh-response.dto";

@ApiTags("Adminusers")
@Controller({
  path: "admin-users",
  version: "1",
})
export class AdminUsersController {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly authService: AuthService,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AdminLoginResponseDto })
  public login(
    @Body() adminLoginDto: AdminLoginDto,
  ): Promise<AdminLoginResponseDto> {
    return this.adminUsersService.validateLogin(adminLoginDto);
  }

  // Admin Users Auth
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
  @Post()
  @ApiCreatedResponse({
    type: AdminUsers,
  })
  create(@Body() createAdminUsersDto: CreateAdminUsersDto) {
    return this.adminUsersService.create(createAdminUsersDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(AdminUsers),
  })
  async findAll(
    @Query() query: FindAllAdminUsersDto,
  ): Promise<InfinityPaginationResponseDto<AdminUsers>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.adminUsersService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
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
  @Patch(":id")
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
  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.adminUsersService.remove(id);
  }
}
