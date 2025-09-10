import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export enum TruckStatus {
  IDLE = "idle",
  LOADING = "loading",
  DEPARTED = "departed",
  COMPLETED = "completed",
}

export class CreateTrucksDto {
  @ApiProperty({
    required: false,
    type: Date,
    nullable: true,
  })
  @IsOptional()
  last_activity_at?: Date | null;

  @ApiProperty({
    required: false,
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  volume_recorded?: number | null;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  type: string;

  @ApiProperty({
    required: true,
    type: String,
    enum: TruckStatus,
  })
  @IsEnum(TruckStatus)
  status: TruckStatus;

  @ApiProperty({
    required: true,
    type: () => [String],
  })
  @Type(() => String)
  @IsArray()
  site_id: string[];

  @ApiProperty({
    required: false,
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  driver_name?: string | null;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  plate_number: string;
}
