import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class FindAllReportsDto {
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
  @IsString()
  @IsOptional()
  site_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  province_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  report_type?: string;
}
