// src/mining-sites/dto/mining-sites-materials-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class MaterialItemDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  percentage: number;

  @ApiProperty()
  price: string;

  @ApiProperty()
  unit: string;
}

export class MiningSitesMaterialsResponseDto {
  @ApiProperty()
  site_id: string;

  @ApiProperty()
  last_updated: string;

  @ApiProperty({ type: [MaterialItemDto] })
  materials: MaterialItemDto[];
}
