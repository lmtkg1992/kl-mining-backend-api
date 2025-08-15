import { ApiProperty } from "@nestjs/swagger";

export class AdminUserGroups {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ example: "Group Name" })
  name: string;

  @ApiProperty({ example: "active" })
  status: string;

  @ApiProperty({ example: "Description of the group" })
  description: string;

  @ApiProperty({
    enum: ["super_admin", "provincial_official", "site_owner"],
  })
  role: "super_admin" | "provincial_official" | "site_owner";

  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  site_ids: number[];

  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  province_ids: number[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
