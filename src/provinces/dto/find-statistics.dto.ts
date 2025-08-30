import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsDateString } from "class-validator";

export class FindStatisticsDto {
  @ApiPropertyOptional({ example: "2025-08-29" })
  @IsOptional()
  @IsDateString()
  date?: string; // YYYY-MM-DD
}
