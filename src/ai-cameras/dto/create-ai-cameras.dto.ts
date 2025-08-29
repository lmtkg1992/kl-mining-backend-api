import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateAiCamerasDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  site_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  location_description: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  ai_features: string[];

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsDateString()
  installed_at: Date;
  
}
