import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { AiCameraFeatureEnum, AiCameraStatusEnum, AiCameraTypeEnum } from "../ai-cameras.enum";

export class CreateAiCamerasDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  site_id: string;

  @ApiProperty({ enum: AiCameraTypeEnum })
  @IsEnum(AiCameraTypeEnum)
  type: AiCameraTypeEnum;

  @ApiProperty()
  @IsString()
  location_description: string;

  @ApiProperty({ type: [String], enum: AiCameraFeatureEnum })
  @IsArray()
  @IsEnum(AiCameraFeatureEnum, { each: true })
  ai_features: AiCameraFeatureEnum[];

  @ApiProperty({ enum: AiCameraStatusEnum })
  @IsEnum(AiCameraStatusEnum)
  status: AiCameraStatusEnum;

  @ApiProperty()
  @IsDateString()
  installed_at: Date;
  
}
