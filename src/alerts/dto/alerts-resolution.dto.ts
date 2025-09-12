import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from "class-validator";

export enum AlertClassification {
  FALSE_POSITIVE = "false_positive",
  UNDER_INVESTIGATION = "under_investigation",
  CONFIRMED_BREACH = "confirmed_breach",
  RESOLVED = "resolved",
}

export class AlertsResolutionDto {
  @ApiProperty({ description: "User ID acknowledging the alert" })
  @IsString()
  @IsNotEmpty()
  acknowledged_by?: string;

  @ApiPropertyOptional({
    description: "Resolution time (ISO8601). Defaults to now",
  })
  @IsOptional()
  @IsDateString()
  acknowledged_at?: string;

  @ApiPropertyOptional({ enum: AlertClassification })
  @IsOptional()
  @IsEnum(AlertClassification)
  classification?: AlertClassification;

  @ApiPropertyOptional({
    description: "Override priority (e.g., Critical, High)",
  })
  @IsOptional()
  @IsString()
  priority_override?: string;

  @ApiPropertyOptional({ description: "Short description / notes" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String], description: "Final actions taken" })
  @IsOptional()
  @IsArray()
  actions_taken?: string[];
}
