// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateAdminUsersDto } from "./create-admin-users.dto";

export class UpdateAdminUsersDto extends PartialType(CreateAdminUsersDto) {}
