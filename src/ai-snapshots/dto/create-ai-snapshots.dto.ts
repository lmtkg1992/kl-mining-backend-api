import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  Min,
  Max,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateAiSnapshotsDto {
  @IsOptional()
  @Type(() => String)
  camera_id?: string | null;

  @ApiProperty({
    type: () => String,
    enum: ["breach", "truck", "normal"],
  })
  @IsEnum(["breach", "truck", "normal"])
  event_type: "breach" | "truck" | "normal";

  @ApiProperty({
    type: () => String,
  })
  @IsUrl()
  image_url: string;

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
}
