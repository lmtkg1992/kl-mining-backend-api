// common/decorators/require-permissions.decorator.ts
import { SetMetadata } from "@nestjs/common";
export const PERMISSION_KEYS_METADATA = "permission_keys";
export const RequirePermissions = (...keys: string[]) =>
  SetMetadata(PERMISSION_KEYS_METADATA, keys);
