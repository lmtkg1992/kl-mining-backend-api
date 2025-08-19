// common/guards/permissions.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEYS_METADATA } from "../decorators/require-permissions.decorator";
import { PermissionsService } from "../../permissions/permissions.service";
import { AdminUsersService } from "../../admin-users/admin-users.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
    private readonly adminUsersService: AdminUsersService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException("Unauthenticated");

    const keys = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEYS_METADATA,
      [ctx.getHandler(), ctx.getClass()],
    );

    const adminUser = await this.adminUsersService.findById(user.id);

    if (keys?.length) {
      const groupId = adminUser?.admin_user_group?.id;
      if (!groupId) throw new ForbiddenException("User has no group assigned");

      const has = await this.permissionsService.groupHasAnyKeys(groupId, keys);
      if (!has) throw new ForbiddenException("Insufficient permissions (keys)");
      return true;
    }

    // const method: string = request.method.toUpperCase();
    // const reqPath: string = request.route?.path || request.baseUrl || request.url;

    // // Chuẩn hóa: loại query-string
    // const normPath = reqPath.split('?')[0];

    // const groupId = user.admin_user_group?.id;
    // const can = await this.permissionsService.groupHasApiAccess(groupId, method, normPath);
    // if (!can) throw new ForbiddenException('Insufficient permissions (API)');
    return false;
  }
}
