import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsUrl,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  Max,
  Matches,
  IsArray,
} from "class-validator";

export class IngestAiSnapshotDto {
  @ApiProperty({
    type: String,
    description: "AI System-provided unique ID (predict_id); used for idempotency and reconciliation",
  })
  @IsString()
  event_id: string;

  @ApiProperty({
    enum: [
      "vehicle_entered",
      "vehicle_exited_loaded_legal",
      "vehicle_exited_loaded_illegal",
      "vehicle_exited_empty",
      "cannot_match_truck_in_db_legal",
      "cannot_match_truck_in_db_illegal",
    ],
    description: "Event type",
  })
  @IsEnum([
    "vehicle_entered",
    "vehicle_exited_loaded_legal",
    "vehicle_exited_loaded_illegal",
    "vehicle_exited_empty",
    "cannot_match_truck_in_db_legal",
    "cannot_match_truck_in_db_illegal",
  ])
  event_type:
    | "vehicle_entered"
    | "vehicle_exited_loaded_legal"
    | "vehicle_exited_loaded_illegal"
    | "vehicle_exited_empty"
    | "cannot_match_truck_in_db_legal"
    | "cannot_match_truck_in_db_illegal";

  @ApiProperty({
    type: String,
    description: "Evidence image at detection moment",
  })
  @IsUrl({ require_protocol: true, protocols: ["https"] })
  image_url: string;

  @ApiProperty({
    type: String,
    description: "Normalize uppercase, remove spaces",
  })
  @IsString()
  plate_number: string;

  @ApiProperty({
    type: String,
    description: "Source camera identifier",
  })
  @IsString()
  camera_code: string;

  @ApiProperty({
    type: String,
    description: "ISO-8601 timestamp, prefer UTC Z",
    example: "2025-10-21T02:15:30Z",
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, {
    message: "timestamp must be in ISO-8601 format (e.g., 2025-10-21T02:15:30Z)",
  })
  timestamp: string;

  @ApiProperty({
    enum: ["in", "out"],
    description: "Mandatory for all vehicle in/out events",
  })
  @IsEnum(["in", "out"])
  direction: "in" | "out";

  @ApiPropertyOptional({
    type: Number,
    description: "Fill level 0-100",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  fill_level?: number;

  @ApiPropertyOptional({
    type: Number,
    description: "Volume estimation",
  })
  @IsOptional()
  @IsNumber()
  volume?: number;

  @ApiPropertyOptional({
    type: Number,
    description: "Confidence score 0-100",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  confidence_score?: number;

  @ApiPropertyOptional({
    type: [String],
    description: "List of base64 encoded images",
    example: ["data:image/jpeg;base64,/9j/4AAQSkZJRg..."],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  list_image?: string[];
}


