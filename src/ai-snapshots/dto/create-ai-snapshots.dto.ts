import { ApiProperty } from "@nestjs/swagger";
import {
  Min,
  Max,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class CreateAiSnapshotsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  camera_id: string;

  @ApiProperty({ enum: ["breach", "truck"] })
  @IsEnum(["breach", "truck"])
  event_type: "breach" | "truck";

  @ApiProperty()
  @IsUrl()
  image_url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  truck_type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fill_level?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence_score: number;
}
