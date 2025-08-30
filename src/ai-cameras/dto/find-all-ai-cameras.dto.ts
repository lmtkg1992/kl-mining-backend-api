import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class FindAllAiCamerasDto {
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

  @ApiPropertyOptional({ description: "Filter by site_id" })
  @IsString()
  @IsOptional()
  site_id?: string;

  @ApiPropertyOptional({ description: "Filter by province_id" })
  @IsString()
  @IsOptional()
  province_id?: string;

  @ApiPropertyOptional({ description: "Filter by status" })
  @IsString()
  @IsOptional()
  status?: string;
}
