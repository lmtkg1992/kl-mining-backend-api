import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class GetRecordingStreamDto {
  @ApiProperty({
    description: "Recording ID from Synology",
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  recording_id: number;

  @ApiPropertyOptional({
    description: "DS ID (optional, default 0)",
    type: Number,
    default: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  ds_id?: number;

  @ApiPropertyOptional({
    description: "Mount ID (optional, default 0)",
    type: Number,
    default: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  mount_id?: number;
}

