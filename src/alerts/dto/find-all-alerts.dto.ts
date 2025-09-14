import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class FindAllAlertsDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  site_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  province_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alert_type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  from_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  to_date?: string;
}
