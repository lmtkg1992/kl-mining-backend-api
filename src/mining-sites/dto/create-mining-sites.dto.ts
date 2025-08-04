import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateMiningSitesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  siteName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerUserId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  provinceId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  boundaryPolygon: string;
}
