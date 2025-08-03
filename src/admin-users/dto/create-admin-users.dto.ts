import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  MinLength,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { UserStatusEnum } from '../admin-users.enum';

export class CreateAdminUsersDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

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

  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email: string | null;
}
