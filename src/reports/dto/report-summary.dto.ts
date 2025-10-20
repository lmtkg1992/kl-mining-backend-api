import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class ReportSummaryDto {
  @ApiProperty({
    type: Number,
    example: 1247,
    description: "Total number of reports in the system",
  })
  @IsNumber()
  total_reports: number;

  @ApiProperty({
    type: Number,
    example: 23,
    description: "Reports currently in pending status",
  })
  @IsNumber()
  pending: number;

  @ApiProperty({
    type: Number,
    example: 47,
    description: "Reports completed today",
  })
  @IsNumber()
  completed_today: number;

  @ApiProperty({
    type: Number,
    example: 3,
    description: "Reports that failed during generation",
  })
  @IsNumber()
  failed: number;
}
