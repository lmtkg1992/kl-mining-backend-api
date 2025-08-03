import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { UserStatusEnum } from "../admin-users.enum";

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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
