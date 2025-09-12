import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, NotEquals } from "class-validator";

export class AdminChangePasswordDto {
  @ApiProperty({ example: "OldP@ssw0rd" })
  @IsString()
  @MinLength(6)
  old_password: string;

  @ApiProperty({ example: "NewStrongerP@ssw0rd!" })
  @IsString()
  @MinLength(8)
  @NotEquals("old_password", { message: "new_password must be different" })
  new_password: string;
}
