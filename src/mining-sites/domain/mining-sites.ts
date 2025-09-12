

import { ApiProperty } from "@nestjs/swagger";
import { Provinces } from "../../provinces/domain/provinces";
import { AdminUsers } from "src/admin-users/domain/admin-users";
import { MiningSitesSettingsDto } from "../dto/mining-sites-settings.dto";

export class MiningSites {
  @ApiProperty({
    type: () => MiningSitesSettingsDto,
    nullable: true,
  })
  site_settings?: MiningSitesSettingsDto | null;


  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  material_type: string;

  @ApiProperty({
    type: () => String,
  })
  id: string;

  @ApiProperty({
    type: () => String,
    description: "Mining site name",
    required: true,
  })
  site_name: string;

  @ApiProperty({
    type: () => String,
    description: "Mining site code",
    required: true,
  })
  site_code: string;

  @ApiProperty({
    type: () => String,
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
    type: () => String,
    description: "Site boundary definition",
    required: false,
  })
  boundary_polygon?: string;

  @ApiProperty({ 
    type: () => Number,
    required: false 
  })
  volume: number;

  @ApiProperty({ 
    type: () => Number,
    required: false 
  })
  trucks: number;

  @ApiProperty({ 
    type: () => Number,
    required: false 
  })
  breaches: number;

  @ApiProperty({ 
    type: () => Number,
    required: false 
  })
  cameras_online: number;

  @ApiProperty({ 
    type: () => Date,
    required: false 
  })
  last_activity: Date;

  @ApiProperty({ 
    type: () => Date,
    required: false ,
    nullable: true
  })
  last_updated_at: Date;

  @ApiProperty({ 
    type: () => Date 
  })
  createdAt: Date;

  @ApiProperty({ 
    type: () => Date 
  })
  updatedAt: Date;
}
