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
import { NotificationsService } from "./notifications.service";
import { CreateNotificationsDto } from "./dto/create-notifications.dto";
import { UpdateNotificationsDto } from "./dto/update-notifications.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Notifications } from "./domain/notifications";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { FindAllNotificationsDto } from "./dto/find-all-notifications.dto";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { infinityPaginationWithMetadata } from "src/utils/infinity-pagination-with-metadata";

@ApiTags("Notifications")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "notifications",
  version: "1",
})
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Notifications,
  })
  create(@Body() createNotificationsDto: CreateNotificationsDto) {
    return this.notificationsService.create(createNotificationsDto);
  }

  @Get('list')
  @RequirePermissions("notifications::list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(Notifications),
  })
  async findAll(
    @Query() query: FindAllNotificationsDto,
  ): Promise<InfinityPaginationResponseDto<Notifications>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.notificationsService.findAllWithFilterAndPagination(
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
  @RequirePermissions("notifications::detail")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Notifications,
  })
  findById(@Param("id") id: string) {
    return this.notificationsService.findById(id);
  }

  @Patch("update/:id")
  @RequirePermissions("notifications::update")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Notifications,
  })
  update(
    @Param("id") id: string,
    @Body() updateNotificationsDto: UpdateNotificationsDto,
  ) {
    return this.notificationsService.update(id, updateNotificationsDto);
  }

  @Delete("delete/:id")
  @RequirePermissions("notifications::delete")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.notificationsService.remove(id);
  }
}
