import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsDateString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AlertsResolutionDto } from "./alerts-resolution.dto";

export class CreateAlertsDto {
  @ApiPropertyOptional({ type: () => AlertsResolutionDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AlertsResolutionDto)
  alerts_resolution?: AlertsResolutionDto | null;

  @ApiPropertyOptional({
    type: () => [String],
    nullable: true,
  })
  @IsOptional()
  evidence_url?: string[] | null;

  @ApiPropertyOptional({
    type: () => String,
    enum: [
      "unauthorized_access",
      "equipment_tampering",
      "perimeter_breach",
      "restricted_zone_entry",
    ],
    nullable: true,
  })
  @IsOptional()
  @IsEnum([
    "unauthorized_access",
    "equipment_tampering",
    "perimeter_breach",
    "restricted_zone_entry",
  ])
  breach_type?:
    | "unauthorized_access"
    | "equipment_tampering"
    | "perimeter_breach"
    | "restricted_zone_entry"
    | null;

  @ApiPropertyOptional({
    type: () => String,
    enum: ["in", "out"],
    nullable: true,
  })
  @IsOptional()
  @IsEnum(["in", "out"])
  direction?: "in" | "out" | null;

  @ApiPropertyOptional({
    type: () => Boolean,
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  overloaded?: boolean | null;

  @ApiPropertyOptional({
    type: () => Number,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  fill_level?: number | null;

  @ApiPropertyOptional({
    type: () => Number,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  confidence?: number | null;

  @ApiProperty({
    required: true,
    type: () => String,
    enum: ["new", "under_review", "acknowledged", "resolved"],
  })
  @IsEnum(["new", "under_review", "acknowledged", "resolved"])
  status: "new" | "under_review" | "acknowledged" | "resolved";

  @ApiProperty({
    required: true,
    type: () => String,
    enum: ["low", "medium", "high", "critical"],
  })
  @IsEnum(["low", "medium", "high", "critical"])
  severity: "low" | "medium" | "high" | "critical";

  @ApiPropertyOptional({
    type: () => String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  event_id?: string | null;

  @ApiPropertyOptional({
    type: () => String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  camera_id?: string | null;

  @ApiPropertyOptional({
    type: () => String,
    enum: ["dump_truck", "loader", "hauler"],
    nullable: true,
  })
  @IsOptional()
  @IsEnum(["dump_truck", "loader", "hauler"])
  truck_type?: "dump_truck" | "loader" | "hauler" | null;

  @ApiPropertyOptional({
    type: () => String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  truck_id?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  site_id: string;

  @ApiProperty({
    required: true,
    type: () => Date,
  })
  @IsDateString()
  timestamp: Date;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: true,
    type: () => String,
    enum: ["truck_activity", "breach_event"],
  })
  @IsEnum(["truck_activity", "breach_event"])
  alert_type: "truck_activity" | "breach_event";
}
