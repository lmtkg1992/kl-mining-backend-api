import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsEmail,
  MinLength,
  IsString,
  IsNotEmpty,
  IsMongoId,
} from "class-validator";
import { lowerCaseTransformer } from "src/utils/transformers/lower-case.transformer";
import { UserStatusEnum } from "../admin-users.enum";

export class CreateAdminUsersDto {
  @ApiProperty({ example: "test1@example.com", type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: "66c9e5f23e86c97d3ab7c9b1" })
  @IsMongoId()
  @IsNotEmpty()
  admin_user_group: string;
}
