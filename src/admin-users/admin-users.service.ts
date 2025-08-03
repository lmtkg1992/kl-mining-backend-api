import {
  // common
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAdminUsersDto } from './dto/create-admin-users.dto';
import { UpdateAdminUsersDto } from './dto/update-admin-users.dto';
import { AdminUsersRepository } from './infrastructure/persistence/admin-users.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AdminUsers } from './domain/admin-users';
import { UserStatusEnum } from './admin-users.enum';
import bcrypt from 'bcryptjs';

@Injectable()
export class AdminUsersService {
  constructor(
    // Dependencies here
    private readonly adminUsersRepository: AdminUsersRepository,
  ) {}

  async create(createAdminUsersDto: CreateAdminUsersDto) {
    // Do not remove comment below.
    // <creating-property />

    const existing = await this.adminUsersRepository.findByUsername(
      createAdminUsersDto.userName,
    );
    if (existing) {
      throw new UnprocessableEntityException({
        statusCode: 400,
        message: 'Username already exists',
        error: 'usernameAlreadyExists',
      });
    }

    let password: string | undefined = undefined;

    if (createAdminUsersDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createAdminUsersDto.password, salt);
    }

    return this.adminUsersRepository.create({
      userName: createAdminUsersDto.userName,
      name: createAdminUsersDto.name,
      status: createAdminUsersDto.status || UserStatusEnum.ACTIVE,
      password,
      email: createAdminUsersDto.email,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.adminUsersRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: AdminUsers['id']) {
    return this.adminUsersRepository.findById(id);
  }

  findByIds(ids: AdminUsers['id'][]) {
    return this.adminUsersRepository.findByIds(ids);
  }

  async update(
    id: AdminUsers['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAdminUsersDto: UpdateAdminUsersDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.adminUsersRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: AdminUsers['id']) {
    return this.adminUsersRepository.remove(id);
  }
}
