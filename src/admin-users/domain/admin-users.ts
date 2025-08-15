import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { UserStatusEnum } from "../admin-users.enum";
import { AdminUserGroups } from "../../admin-user-groups/domain/admin-user-groups";

export class AdminUsers {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  email: string;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({ type: () => AdminUserGroups })
  admin_user_group: AdminUserGroups;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
