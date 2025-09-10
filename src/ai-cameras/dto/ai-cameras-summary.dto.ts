import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty } from "class-validator";

export class AiCamerasSummaryDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total_cameras: number;

  @ApiProperty() 
  @IsNumber()
  @IsNotEmpty()
  operational: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maintenance: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  offline: number;
}