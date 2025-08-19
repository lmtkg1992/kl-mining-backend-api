import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreatePermissionsDto } from "./dto/create-permissions.dto";
import { UpdatePermissionsDto } from "./dto/update-permissions.dto";
import { PermissionsRepository } from "./infrastructure/persistence/permissions.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Permissions } from "./domain/permissions";
import { FindAllPermissionsDto } from "./dto/find-all-permissions.dto";

@Injectable()
export class PermissionsService {
  constructor(
    // Dependencies here
    private readonly permissionsRepository: PermissionsRepository,
  ) {}

  async create(createPermissionsDto: CreatePermissionsDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.permissionsRepository.create({
      name: createPermissionsDto.name,
      method: createPermissionsDto.method,
      path: createPermissionsDto.path,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.permissionsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllPermissionsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entites, total] = await Promise.all([
      this.permissionsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.permissionsRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: Permissions["id"]) {
    return this.permissionsRepository.findById(id);
  }

  findByIds(ids: Permissions["id"][]) {
    return this.permissionsRepository.findByIds(ids);
  }

  async update(
    id: Permissions["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatePermissionsDto: UpdatePermissionsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.permissionsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Permissions["id"]) {
    return this.permissionsRepository.remove(id);
  }
}
