import { ApiProperty } from "@nestjs/swagger";

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
    description: "Site owner reference",
    required: true,
  })
  ownerUserId: string;

  @ApiProperty({
    type: String,
    description: "Province Id",
    required: true,
  })
  provinceId: string;

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
