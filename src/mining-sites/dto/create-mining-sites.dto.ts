import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsMongoId } from "class-validator";

export class CreateMiningSitesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  site_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  owner_user_id: string;

  @ApiProperty({ example: "66c9e5f23e86c97d3ab7c9b1" })
  @IsMongoId()
  @IsNotEmpty()
  province: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  boundary_polygon: string;
}
