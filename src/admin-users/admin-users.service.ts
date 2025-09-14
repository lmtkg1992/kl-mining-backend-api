import {
  // common
  Injectable,
  UnprocessableEntityException,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ms from "ms";

import { JwtPayloadType } from "../auth/strategies/types/jwt-payload.type";
import { AllConfigType } from "../config/config.type";
import { JwtRefreshPayloadType } from "../auth/strategies/types/jwt-refresh-payload.type";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { UserStatusEnum } from "./admin-users.enum";
import { RoleEnum } from "../roles/roles.enum";

import { AdminUsers } from "./domain/admin-users";
import { Session } from "../session/domain/session";
import { User } from "../users/domain/user";
import { AdminUserGroups } from "../admin-user-groups/domain/admin-user-groups";

import { CreateAdminUsersDto } from "./dto/create-admin-users.dto";
import { UpdateAdminUsersDto } from "./dto/update-admin-users.dto";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AdminLoginResponseDto } from "./dto/admin-login-response.dto";
import { FindAllAdminUsersDto } from "./dto/find-all-admin-users.dto";
import { AdminStatisticsResponseDto } from "./dto/admin-statistics-response.dto";
import { FindStatisticsDto } from "./dto/find-statistics.dto";
import { FindAllAiCamerasDto } from "../ai-cameras/dto/find-all-ai-cameras.dto";

import { SessionService } from "../session/session.service";
import { PermissionsService } from "../permissions/permissions.service";
import { ProvincesService } from "../provinces/provinces.service";
import { MiningSitesService } from "../mining-sites/mining-sites.service";

import { AdminUsersRepository } from "./infrastructure/persistence/admin-users.repository";
import { AiCamerasRepository } from "../ai-cameras/infrastructure/persistence/ai-cameras.repository";
import { AlertsRepository } from "../alerts/infrastructure/persistence/alerts.repository";

import { FindAllAlertsDto } from "../alerts/dto/find-all-alerts.dto";
import { AlertSummaryDto } from "../alerts/dto/alert-summary.dto";
import { AdminUsersSummaryDto } from "./dto/admin-users-summary.dto";
import { AdminChangePasswordDto } from "./dto/admin-change-password.dto";
import { MiningSitesRepository } from "src/mining-sites/infrastructure/persistence/mining-sites.repository";

@Injectable()
export class AdminUsersService {
  constructor(
    // Dependencies here
    private readonly adminUsersRepository: AdminUsersRepository,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    private readonly permissionsService: PermissionsService,
    private readonly provincesService: ProvincesService,
    private readonly miningSitesService: MiningSitesService,
    private readonly aiCamerasRepository: AiCamerasRepository,
    private readonly alertsRepository: AlertsRepository,
    private readonly miningSitesRepository: MiningSitesRepository,
  ) {}

  async changePassword(
    userId: string,
    dto: AdminChangePasswordDto,
  ): Promise<void> {
    const user = await this.adminUsersRepository.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    // ensure we have the stored hash
    if (!user.password) {
      throw new UnprocessableEntityException({
        status: 422,
        errors: { old_password: "invalid" },
      });
    }

    const ok = await bcrypt.compare(dto.old_password, user.password);
    if (!ok) {
      throw new UnprocessableEntityException({
        status: 422,
        errors: { old_password: "invalid" },
      });
    }

    const salt = await bcrypt.genSalt();
    const newHash = await bcrypt.hash(dto.new_password, salt);
    await this.adminUsersRepository.update(userId, { password: newHash });
  }

  async create(createAdminUsersDto: CreateAdminUsersDto) {
    // Do not remove comment below.
    // <creating-property />

    const existing = await this.adminUsersRepository.findByEmail(
      createAdminUsersDto.email,
    );
    if (existing) {
      throw new UnprocessableEntityException({
        statusCode: 400,
        message: "Username already exists",
        error: "usernameAlreadyExists",
      });
    }

    let password: string | undefined = undefined;

    if (createAdminUsersDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createAdminUsersDto.password, salt);
    }

    return this.adminUsersRepository.create({
      email: createAdminUsersDto.email,
      name: createAdminUsersDto.name,
      phone_number: createAdminUsersDto.phone_number ?? undefined,
      status: createAdminUsersDto.status || UserStatusEnum.ACTIVE,
      password,
      admin_user_group: {
        id: createAdminUsersDto.admin_user_group,
      } as AdminUserGroups,
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

  async findAllWithFilterAndPagination(
    query: FindAllAdminUsersDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entites, total] = await Promise.all([
      this.adminUsersRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.adminUsersRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: AdminUsers["id"]) {
    return this.adminUsersRepository.findById(id);
  }

  findByIds(ids: AdminUsers["id"][]) {
    return this.adminUsersRepository.findByIds(ids);
  }

  findByEmail(email: string) {
    return this.adminUsersRepository.findByEmail(email);
  }

  async update(
    id: AdminUsers["id"],

    updateAdminUsersDto: UpdateAdminUsersDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.adminUsersRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      email: updateAdminUsersDto.email,
      name: updateAdminUsersDto.name,
      phone_number: updateAdminUsersDto.phone_number ?? undefined,
      status: updateAdminUsersDto.status,
      admin_user_group: {
        id: updateAdminUsersDto.admin_user_group,
      } as AdminUserGroups,
    });
  }

  remove(id: AdminUsers["id"]) {
    return this.adminUsersRepository.remove(id);
  }

  // Admin Users Auth
  async me(user: JwtPayloadType) {
    const userData = await this.adminUsersRepository.findById(
      user.id.toString(),
    );

    // Get all permissions and map to resource keys
    let permissionIds: string[] = [];
    if (userData?.admin_user_group?.permission_ids) {
      if (Array.isArray(userData.admin_user_group.permission_ids)) {
        permissionIds = userData.admin_user_group.permission_ids.map(String);
      } else if (typeof userData.admin_user_group.permission_ids === "string") {
        permissionIds = JSON.parse(userData.admin_user_group.permission_ids);
      }
    }
    const permissions = await this.permissionsService.findByIds(permissionIds);

    (userData!.admin_user_group! as any).permissions = permissions.map(
      (permission) => permission.resourceKey,
    );

    // Get all provinces
    let provinceIds: string[] = [];
    if (userData?.admin_user_group?.province_ids) {
      if (Array.isArray(userData.admin_user_group.province_ids)) {
        provinceIds = userData.admin_user_group.province_ids.map(String);
      } else if (typeof userData.admin_user_group.province_ids === "string") {
        provinceIds = JSON.parse(userData.admin_user_group.province_ids);
      }
    }

    const provinces = await this.provincesService.findByIds(provinceIds);

    (userData!.admin_user_group! as any).provinces = provinces;

    // Get all mining sites
    let miningSiteIds: string[] = [];
    if (userData?.admin_user_group?.site_ids) {
      if (Array.isArray(userData.admin_user_group.site_ids)) {
        miningSiteIds = userData.admin_user_group.site_ids.map(String);
      } else if (typeof userData.admin_user_group.site_ids === "string") {
        miningSiteIds = JSON.parse(userData.admin_user_group.site_ids);
      }
    }

    const miningSites = await this.miningSitesService.findByIds(miningSiteIds);

    (userData!.admin_user_group! as any).mining_sites = miningSites;

    return userData;
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, "sessionId" | "hash">,
  ): Promise<Omit<AdminLoginResponseDto, "user">> {
    const session = await this.sessionService.findById(data.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash("sha256")
      .update(randomStringGenerator())
      .digest("hex");

    // const user = await this.findById(session.user.id.toString());

    // if (!user?.role) {
    //   throw new UnauthorizedException();
    // }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      role: {
        id: RoleEnum.admin,
      },
      sessionId: session.id,
      hash,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async validateLogin(loginDto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    const user = await this.findByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: "notFound",
        },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: "incorrectPassword",
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: "incorrectPassword",
        },
      });
    }

    const hash = crypto
      .createHash("sha256")
      .update(randomStringGenerator())
      .digest("hex");

    const session = await this.sessionService.create({
      user: user as unknown as User,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: { id: RoleEnum.admin },
      sessionId: session.id,
      hash,
    });

    await this.adminUsersRepository.update(user.id, {
      last_login_at: new Date(),
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user: user as AdminUsers,
    };
  }

  private async getTokensData(data: {
    id: User["id"];
    role: User["role"];
    sessionId: Session["id"];
    hash: Session["hash"];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow("auth.expires", {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow("auth.secret", { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow("auth.refreshSecret", {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow("auth.refreshExpires", {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async getStatistics(
    query: FindStatisticsDto,
  ): Promise<AdminStatisticsResponseDto> {
    const dateFilter = query.date ?? new Date().toISOString().slice(0, 10);

    const totalSites = await this.miningSitesRepository.countWithFilter({});
    const operationalSites = await this.miningSitesRepository.countWithFilter({
      status: "active",
    });
    const currentDate = new Date(dateFilter);
    const nextDate = new Date(dateFilter);
    nextDate.setDate(nextDate.getDate() + 1);
    const previousDate = new Date(dateFilter);
    previousDate.setDate(previousDate.getDate() - 1);
    const listSites = await this.miningSitesRepository.findAllWithFilterAndPagination({
      filter: {},
      paginationOptions: {
        page: 1,
        limit: 10000,
      },
    });
    const listSitesIds = listSites.map((site) => site.id);
    const totalBreachAlerts = await this.alertsRepository.countWithFilter({
      alert_type: "breach_event",
      from_date: currentDate,
      to_date: nextDate,
    });
    const yesterdayBreachAlerts = await this.alertsRepository.countWithFilter({
      alert_type: "breach_event",
      from_date: previousDate,
      to_date: currentDate,
    });
    let changeBreachAlerts = 0;
    if(yesterdayBreachAlerts > 0){
      changeBreachAlerts = (totalBreachAlerts - yesterdayBreachAlerts) / yesterdayBreachAlerts * 100;
    }
    const totalTruckActivities = await this.alertsRepository.countWithFilter({
      alert_type: "truck_activity",
      from_date: currentDate,
      to_date: nextDate,
    });
    const yesterdayTruckActivities = await this.alertsRepository.countWithFilter({
      alert_type: "truck_activity",
      from_date: previousDate,
      to_date: currentDate,
    });
    let changeTruckActivities = 0;
    if(yesterdayTruckActivities > 0){
      changeTruckActivities = (totalTruckActivities - yesterdayTruckActivities) / yesterdayTruckActivities * 100;
    }
    const volumePerCar = MiningSitesService.VOLUME_PER_CAR;
    const quotaMiningSitePerDay = MiningSitesService.QUOTA_MINING_SITE_PER_DAY;
    const volumeTruckOut = await this.alertsRepository.findAllWithFilterAndPagination({
      filter: {
        site_id: { $in: listSitesIds },
        alert_type: "truck_activity",
        direction: "out",
        from_date: currentDate,
        to_date: nextDate,
      },
      paginationOptions: {  
        page: 1,
        limit: 10000,
      },
    });
    const totalVolumeTruckOut = Math.floor(volumeTruckOut.reduce((acc, curr) => acc + volumePerCar * (curr.fill_level ? curr.fill_level/100 : 0), 0));
    const percentageQuota = Math.floor((totalVolumeTruckOut / quotaMiningSitePerDay) * 100) ;
    return {
      last_updated: new Date().toISOString(),
      site_status: {
        total_sites: totalSites,
        operational_sites: operationalSites,
        status_text: `${operationalSites}/${totalSites} operational`,
      },
      breach_alerts: {
        count: totalBreachAlerts,
        change: changeBreachAlerts,
      },
      truck_activities: {
        count: totalTruckActivities,
        change: changeTruckActivities,
      },
      total_volume: {
        value: totalVolumeTruckOut,
        unit: "m3",
        percentage_quota: percentageQuota,
      },
    };
  }

  async getAdminUsersSummary(): Promise<AdminUsersSummaryDto> {
    const users =
      await this.adminUsersRepository.findAllWithFilterAndPagination({
        filter: {},
        paginationOptions: {
          page: 1,
          limit: 10000,
        },
      });

    const total = users.length;

    // Role distribution
    const roleMap: Record<string, number> = {};
    users.forEach((u) => {
      const role = u.admin_user_group?.role || "Unknown";
      roleMap[role] = (roleMap[role] || 0) + 1;
    });

    const role_distribution = Object.entries(roleMap).map(([role, count]) => ({
      role,
      count,
      percentage: Number(((count / total) * 100).toFixed(1)),
    }));

    // Province distribution
    const provinceMap: Record<string, number> = {};

    // Process users sequentially to avoid race conditions
    for (const u of users) {
      try {
        const siteIds = u.admin_user_group?.site_ids || "[]";

        // Parse site_ids safely
        let parsedSiteIds: string[] = [];
        if (typeof siteIds === "string") {
          try {
            parsedSiteIds = JSON.parse(siteIds);
          } catch (error) {
            console.warn(`Failed to parse site_ids for user ${u.id}:`, siteIds);
            parsedSiteIds = [];
          }
        } else if (Array.isArray(siteIds)) {
          parsedSiteIds = siteIds;
        }

        // Remove duplicates from parsedSiteIds
        parsedSiteIds = [...new Set(parsedSiteIds)];

        // Only proceed if we have valid site IDs
        if (parsedSiteIds.length > 0) {
          const sites = await this.miningSitesService.findByIds(parsedSiteIds);
          let provinces: string[] = [];
          for (const site of sites) {
            if (site.province?.province_name) {
              provinces.push(site.province?.province_name);
            }
          }
          provinces = [...new Set(provinces)];
          for (const province of provinces) {
            provinceMap[province] = (provinceMap[province] || 0) + 1;
          }
        }
      } catch (error) {
        console.warn(
          `Error processing user ${u.id} for province distribution:`,
          error,
        );
      }
    }

    const provincial_distribution = Object.entries(provinceMap).map(
      ([province, count]) => ({
        province,
        count,
        percentage: Number(((count / total) * 100).toFixed(1)),
      }),
    );

    return {
      role_distribution,
      provincial_distribution,
    };
  }

  async getLiveAiCameras(
    query: FindAllAiCamerasDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};
    if (query.status) {
      filter.status = query.status;
    }

    const [entities, total] = await Promise.all([
      this.aiCamerasRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.aiCamerasRepository.countWithFilter(filter),
    ]);

    return { entities, total };
  }

  async getAlerts(
    query: FindAllAlertsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};
    if (query.site_id) {
      filter.site_id = query.site_id;
    }
    if (query.alert_type) {
      filter.alert_type = query.alert_type;
    }
    const [entities, total] = await Promise.all([
      this.alertsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.alertsRepository.countWithFilter(filter),
    ]);
    return { entities, total };
  }

  async getAlertSummary(): Promise<AlertSummaryDto> {
    const [breachAlertData, truckActivitiesData] = await Promise.all([
      this.alertsRepository.getBreachAlertSummary("admin"),
      this.alertsRepository.getTruckActivitiesSummary("admin"),
    ]);

    return {
      breach_alert_summary: {
        total_alerts: breachAlertData.total_alerts,
        critical_alerts: breachAlertData.critical_alerts,
        high_confidence_alerts: breachAlertData.high_confidence_alerts,
        acknowledged_resolved: breachAlertData.acknowledged_resolved,
      },
      truck_activity_summary: {
        trucks_in: truckActivitiesData.trucks_in,
        trucks_out: truckActivitiesData.trucks_out,
        truck_in_activities: truckActivitiesData.truck_in_activities,
        truck_overloaded: truckActivitiesData.truck_overloaded,
      },
    };
  }
}
