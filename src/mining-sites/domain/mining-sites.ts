import { ApiProperty } from "@nestjs/swagger";
import { Provinces } from "../../provinces/domain/provinces";

export class MiningSites {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    description: "Mining site name",
    required: true,
  })
  siteName: string;

  @ApiProperty({
    type: String,
    description: "Mining site status",
    required: true,
  })
  status: string;

  @ApiProperty({
    type: String,
    description: "Site owner reference",
    required: true,
  })
  ownerUserId: string;

  @ApiProperty({
    type: () => Provinces,
    description: "Province",
    required: true,
  })
  province: Provinces;

  @ApiProperty({
    type: String,
    description: "Site boundary definition",
    required: false,
  })
  boundaryPolygon?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
