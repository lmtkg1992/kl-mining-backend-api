// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateAdminUserGroupsDto } from "./create-admin-user-groups.dto";

export class UpdateAdminUserGroupsDto extends PartialType(
  CreateAdminUserGroupsDto,
) {}
