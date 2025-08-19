import { IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePermissionsDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  path: string;
}
