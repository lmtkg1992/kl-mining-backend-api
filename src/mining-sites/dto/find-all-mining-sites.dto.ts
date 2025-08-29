import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsMongoId, IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class FindAllMiningSitesDto {
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

  @ApiPropertyOptional({ example: "66c9e5f23e86c97d3ab7c9b1" })
  @IsMongoId()
  @IsOptional()
  province_id?: string;
}
