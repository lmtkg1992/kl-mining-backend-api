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
  site_name: string;

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
  owner_user_id: string;

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
  boundary_polygon?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
