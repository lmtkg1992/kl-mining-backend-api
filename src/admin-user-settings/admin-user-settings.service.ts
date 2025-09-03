import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateAdminUserSettingsDto } from "./dto/create-admin-user-settings.dto";
import { UpdateAdminUserSettingsDto } from "./dto/update-admin-user-settings.dto";
import { AdminUserSettingsRepository } from "./infrastructure/persistence/admin-user-settings.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { AdminUserSettings } from "./domain/admin-user-settings";
import { FindAllAdminUserSettingsDto } from "./dto/find-all-admin-user-settings.dto";
import { AdminUsers } from "../admin-users/domain/admin-users";

@Injectable()
export class AdminUserSettingsService {
  constructor(
    // Dependencies here
    private readonly adminUserSettingsRepository: AdminUserSettingsRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createAdminUserSettingsDto: CreateAdminUserSettingsDto,
  ) {

    console.log(createAdminUserSettingsDto);

    return this.adminUserSettingsRepository.create({
      admin_user_id: {
        id: createAdminUserSettingsDto.admin_user_id,
      } as AdminUsers,
      security_breach_alerts: createAdminUserSettingsDto.security_breach_alerts || true,
      truck_detection_alerts: createAdminUserSettingsDto.truck_detection_alerts || true,
      camera_health_alerts: createAdminUserSettingsDto.camera_health_alerts || true,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.adminUserSettingsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllAdminUserSettingsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entites, total] = await Promise.all([
      this.adminUserSettingsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.adminUserSettingsRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: AdminUserSettings["id"]) {
    return this.adminUserSettingsRepository.findById(id);
  }

  findByIds(ids: AdminUserSettings["id"][]) {
    return this.adminUserSettingsRepository.findByIds(ids);
  }

  async update(
    id: AdminUserSettings["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAdminUserSettingsDto: UpdateAdminUserSettingsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.adminUserSettingsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: AdminUserSettings["id"]) {
    return this.adminUserSettingsRepository.remove(id);
  }
}
