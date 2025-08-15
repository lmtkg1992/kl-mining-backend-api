import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AdminUserGroupsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
