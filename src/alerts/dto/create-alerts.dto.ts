import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
} from "class-validator";

export class CreateAlertsDto {
  @ApiProperty({ enum: ["breach", "truck", "after_hours"] })
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
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  site_id: string;

  @ApiProperty({ enum: ["info", "warning", "critical"], default: "warning" })
  @IsString()
  severity: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  resolved?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  truck_id?: string;

  @ApiProperty()
  @IsDateString()
  timestamp: Date;
}
