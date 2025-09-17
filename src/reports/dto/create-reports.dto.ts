import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString
} from 'class-validator';
import { ReportStatus, ReportType } from '../domain/reports';

export class CreateReportsDto {
  @ApiProperty({
    enum: ReportType,
    required: true,
  })
  @IsEnum(ReportType)
  report_type: ReportType;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  site_id: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  province_id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDateString()
  end_date: string;

  @ApiProperty({
    type: () => String,
    required: true,
  })
  @IsString()
  generated_by: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDateString()
  generated_at: string;

  @ApiProperty({
    enum: ReportStatus,
    required: true,
  })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  export_format: string;

  @ApiProperty({
    type: Object,
    required: false,
  })
  @IsOptional()
  content_metadata?: any | null;

  @ApiProperty({
    type: Object,
    required: false,
  })
  @IsOptional()
  file_metadata?: any | null;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  file_url?: string | null;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  comments?: string | null;

  @ApiProperty({
    type: Object,
    required: false,
  })
  @IsOptional()
  report_options?: any | null;

  @ApiProperty({
    type: Object,
    required: false,
  })
  @IsOptional()
  snapshots?: any | null;
}