import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsMongoId,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  ActivityStatus,
  ActivityPriority,
  ActivityEventType,
} from "../domain/activities";

export class CreateActivitiesDto {
  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  volume?: number | null;

  @ApiProperty({
    required: false,
    type: String,
    description: "Truck ID",
  })
  @IsOptional()
  @IsMongoId()
  truck_id?: string | null;

  @ApiProperty({
    required: false,
    type: String,
    description: "Camera ID",
  })
  @IsOptional()
  @IsMongoId()
  camera_id?: string | null;

  @ApiProperty({
    required: false,
    type: String,
    description: "Mining Site ID",
  })
  @IsOptional()
  @IsMongoId()
  site_id?: string | null;

  @ApiProperty({
    required: true,
    enum: ActivityStatus,
  })
  @IsEnum(ActivityStatus)
  status: ActivityStatus;

  @ApiProperty({
    required: true,
    enum: ActivityPriority,
  })
  @IsEnum(ActivityPriority)
  priority: ActivityPriority;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  message: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: true,
    enum: ActivityEventType,
  })
  @IsEnum(ActivityEventType)
  event_type: ActivityEventType;
}
