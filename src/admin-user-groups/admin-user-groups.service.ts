import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateAdminUserGroupsDto } from "./dto/create-admin-user-groups.dto";
import { UpdateAdminUserGroupsDto } from "./dto/update-admin-user-groups.dto";
import { AdminUserGroupsRepository } from "./infrastructure/persistence/admin-user-groups.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { AdminUserGroups } from "./domain/admin-user-groups";
import { FindAllAdminUserGroupsDto } from "./dto/find-all-admin-user-groups.dto";

@Injectable()
export class AdminUserGroupsService {
  constructor(
    // Dependencies here
    private readonly adminUserGroupsRepository: AdminUserGroupsRepository,
  ) {}

  async create(createAdminUserGroupsDto: CreateAdminUserGroupsDto) {
    return this.adminUserGroupsRepository.create({
      name: createAdminUserGroupsDto.name,
      status: createAdminUserGroupsDto.status,
      description: createAdminUserGroupsDto.description,
      role: createAdminUserGroupsDto.role,
      site_ids: createAdminUserGroupsDto.site_ids,
      province_ids: createAdminUserGroupsDto.province_ids,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.adminUserGroupsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllAdminUserGroupsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entites, total] = await Promise.all([
      this.adminUserGroupsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.adminUserGroupsRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }


  findById(id: AdminUserGroups["id"]) {
    return this.adminUserGroupsRepository.findById(id);
  }

  findByIds(ids: AdminUserGroups["id"][]) {
    return this.adminUserGroupsRepository.findByIds(ids);
  }

  async update(
    id: AdminUserGroups["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAdminUserGroupsDto: UpdateAdminUserGroupsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.adminUserGroupsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: AdminUserGroups["id"]) {
    return this.adminUserGroupsRepository.remove(id);
  }
}
