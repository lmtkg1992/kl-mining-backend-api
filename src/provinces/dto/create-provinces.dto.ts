import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateProvincesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  provinceName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  provinceCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}
