import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  ValidateNested,
} from "class-validator";
import { MiningSitesSettingsDto } from "./mining-sites-settings.dto";

export class CreateMiningSitesDto {
  @ApiPropertyOptional({ type: () => MiningSitesSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MiningSitesSettingsDto)
  site_settings?: MiningSitesSettingsDto;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  material_type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  site_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  site_code: string;

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

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  last_updated_at?: Date | null;
}
