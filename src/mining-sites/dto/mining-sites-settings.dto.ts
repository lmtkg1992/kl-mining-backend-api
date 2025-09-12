import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsArray, IsString, IsOptional } from "class-validator";

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
}
