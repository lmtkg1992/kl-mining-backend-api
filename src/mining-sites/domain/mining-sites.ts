import { ApiProperty } from "@nestjs/swagger";
import { Provinces } from "../../provinces/domain/provinces";
import { AdminUsers } from "src/admin-users/domain/admin-users";

export class MiningSites {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  material_type: string;

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
    description: "Mining site code",
    required: true,
  })
  site_code: string;

  @ApiProperty({
    type: String,
    description: "Mining site status",
    required: true,
  })
  status: string;

  @ApiProperty({ type: () => AdminUsers })
  owner_user_id: AdminUsers;

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

  @ApiProperty({ required: false })
  volume: number;

  @ApiProperty({ required: false })
  trucks: number;

  @ApiProperty({ required: false })
  breaches: number;

  @ApiProperty({ required: false })
  cameras_online: number;

  @ApiProperty({ required: false })
  last_activity: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
