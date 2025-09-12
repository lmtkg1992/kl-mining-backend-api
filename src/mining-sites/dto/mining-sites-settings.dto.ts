import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsArray, IsString, IsOptional, IsObject } from "class-validator";

export class MiningSitesSettingsDto {
  @ApiPropertyOptional({ example: 70 })
  @IsOptional()
  @IsNumber()
  cameras_confidence_threshold?: number;

  @ApiPropertyOptional({
    example: ["unauthorized_vehicle", "after_activity", "over_exaggerated"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alerts_trigger_conditions?: string[];

  @ApiPropertyOptional({ example: "08-17" })
  @IsOptional()
  @IsString()
  trucks_activity_hours?: string;

  @ApiPropertyOptional({
    example: [
      { material_name: "Iron Ore", percentage: 50 },
      { material_name: "Copper Ore", percentage: 50 },
    ],
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  material_percentage?: Array<{
    material_name: string;
    percentage: number;
  }>;
  
}
