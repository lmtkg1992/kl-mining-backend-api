import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateAdminUserGroupsDto {
  @ApiProperty({ example: "Group Name" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: "active" })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: "Description of the group" })
  @IsString()
  description: string;

  @ApiProperty({
    enum: ["super_admin", "provincial_official", "site_owner"],
  })
  @IsEnum(["super_admin", "provincial_official", "site_owner"])
  role: "super_admin" | "provincial_official" | "site_owner";

  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  site_ids: number[];

  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  province_ids: number[];
}
