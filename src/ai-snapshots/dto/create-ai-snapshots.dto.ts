import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  Min,
  Max,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateAiSnapshotsDto {
  @IsOptional()
  @Type(() => String)
  camera_id?: string | null;

  @ApiPropertyOptional({
    type: () => String,
    description: "AI System-provided unique ID",
  })
  @IsOptional()
  @IsString()
  event_id?: string;

  @ApiProperty({
    type: () => String,
    enum: ["breach", "truck", "normal"],
  })
  @IsEnum(["breach", "truck", "normal"])
  event_type: "breach" | "truck" | "normal";

  @ApiPropertyOptional({
    type: () => String,
  })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiPropertyOptional({
    type: () => String,
  })
  @IsOptional()
  @IsString()
  truck_type?: string;

  @ApiPropertyOptional({
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  fill_level?: number;

  @ApiProperty({
    type: () => Number,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence_score: number;

  @ApiPropertyOptional({
    type: () => String,
    description: "Vehicle plate number",
  })
  @IsOptional()
  @IsString()
  plate_number?: string;

  @ApiPropertyOptional({
    type: () => String,
    description: "Source camera identifier",
  })
  @IsOptional()
  @IsString()
  camera_code?: string;

  @ApiPropertyOptional({
    type: () => String,
    description: "ISO-8601 timestamp",
  })
  @IsOptional()
  @IsString()
  timestamp?: string;

  @ApiPropertyOptional({
    enum: ["in", "out"],
    description: "Direction",
  })
  @IsOptional()
  @IsEnum(["in", "out"])
  direction?: "in" | "out";

  @ApiPropertyOptional({
    type: () => Number,
    description: "Volume estimation",
  })
  @IsOptional()
  @IsNumber()
  volume?: number;

  @ApiPropertyOptional({
    enum: ["processing", "processed"],
    description: "Status",
  })
  @IsOptional()
  @IsEnum(["processing", "processed"])
  status?: "processing" | "processed";
}
