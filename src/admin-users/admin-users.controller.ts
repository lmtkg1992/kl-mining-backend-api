import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUsersDto } from './dto/create-admin-users.dto';
import { UpdateAdminUsersDto } from './dto/update-admin-users.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AdminUsers } from './domain/admin-users';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllAdminUsersDto } from './dto/find-all-admin-users.dto';

@ApiTags('Adminusers')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'admin-users',
  version: '1',
})
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Post()
  @ApiCreatedResponse({
    type: AdminUsers,
  })
  create(@Body() createAdminUsersDto: CreateAdminUsersDto) {
    return this.adminUsersService.create(createAdminUsersDto);
  }

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

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AdminUsers,
  })
  findById(@Param('id') id: string) {
    return this.adminUsersService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AdminUsers,
  })
  update(
    @Param('id') id: string,
    @Body() updateAdminUsersDto: UpdateAdminUsersDto,
  ) {
    return this.adminUsersService.update(id, updateAdminUsersDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.adminUsersService.remove(id);
  }
}
