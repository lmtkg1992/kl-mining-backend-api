import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { PersonnelStatus } from "../domain/personnel-status.enum";

export class FindAllPersonnelsDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter by personnel status',
    enum: PersonnelStatus,
  })
  @IsOptional()
  @IsEnum(PersonnelStatus)
  status?: PersonnelStatus;

  @ApiPropertyOptional({
    description: 'Filter by department',
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    description: 'Search by full name',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
