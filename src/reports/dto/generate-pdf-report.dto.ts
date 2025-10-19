import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsObject
} from 'class-validator';
import { ReportType } from '../domain/reports';

export enum ExportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  XLSX = 'xlsx',
}

export class GenerateReportDto {
  @ApiProperty({
    enum: ReportType,
    required: true,
    description: 'Type of report to generate',
  })
  @IsEnum(ReportType)
  report_type: ReportType;

  @ApiProperty({
    enum: ExportFormat,
    required: true,
    description: 'Export format for the report',
    example: ExportFormat.PDF,
  })
  @IsEnum(ExportFormat)
  export_format: ExportFormat;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Site ID for filtering data',
  })
  @IsOptional()
  @IsString()
  site_id?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Province ID for filtering data',
  })
  @IsOptional()
  @IsString()
  province_id?: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Start date for the report period',
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'End date for the report period',
  })
  @IsDateString()
  end_date: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'ID of the user generating the report',
  })
  @IsString()
  generated_by: string;

  @ApiProperty({
    type: Object,
    required: false,
    description: 'Additional options for report generation',
  })
  @IsOptional()
  @IsObject()
  report_options?: any;

  @ApiProperty({
    type: Object,
    required: false,
    description: 'Metadata for report content',
  })
  @IsOptional()
  @IsObject()
  content_metadata?: any;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Additional comments for the report',
  })
  @IsOptional()
  @IsString()
  comments?: string;
}

