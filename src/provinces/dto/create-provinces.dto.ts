import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateProvincesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  province_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  province_code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}
