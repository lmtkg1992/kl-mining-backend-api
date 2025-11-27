import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class GetCameraRecordingsDto {
  @ApiProperty({
    description: "Camera ID from Synology",
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  camera_id: number;

  @ApiPropertyOptional({
    description: "Start time (ISO 8601 string or Unix timestamp in milliseconds)",
    type: String,
  })
  @IsOptional()
  @IsString()
  from_time?: string;

  @ApiPropertyOptional({
    description: "End time (ISO 8601 string or Unix timestamp in milliseconds)",
    type: String,
  })
  @IsOptional()
  @IsString()
  to_time?: string;

  @ApiPropertyOptional({
    description: "Number of records to return",
    type: Number,
    default: 100,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: "Offset for pagination",
    type: Number,
    default: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}

