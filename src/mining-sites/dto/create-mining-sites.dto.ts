import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsMongoId } from "class-validator";

export class CreateMiningSitesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  siteName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerUserId: string;

  @ApiProperty({ example: "66c9e5f23e86c97d3ab7c9b1" })
  @IsMongoId()
  @IsNotEmpty()
  province: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  boundaryPolygon: string;
}
