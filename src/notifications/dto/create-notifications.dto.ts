import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsBoolean,
} from "class-validator";

export class CreateNotificationsDto {
  // Event core
  @ApiProperty({ enum: ["breach", "truck", "camera", "report"] })
  @IsString()
  @IsNotEmpty()
  event_type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  event_id: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  event_link?: string;

  // Notification content
  @ApiProperty({ enum: ["breach", "truck", "camera", "report"] })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  site_id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  camera_id?: string;

  @ApiProperty({
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  })
  @IsString()
  priority: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  is_read?: boolean;
}
