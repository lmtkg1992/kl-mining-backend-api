import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
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
    enum: ["admin", "provincial_official", "site_owner"],
  })
  @IsEnum(["admin", "provincial_official", "site_owner"])
  role: "admin" | "provincial_official" | "site_owner";

  @ApiProperty({ type: [String], example: ["1", "2", "3"] })
  @IsArray()
  @Type(() => String)
  site_ids: string[];

  @ApiProperty({ type: [String], example: ["1", "2", "3"] })
  @IsArray()
  @Type(() => String)
  province_ids: string[];

  @ApiProperty({ type: [String], example: ["1", "2", "3"] })
  @IsArray()
  @Type(() => String)
  permission_ids: string[];
}
