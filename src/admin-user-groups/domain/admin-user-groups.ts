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
    enum: ["admin", "provincial_official", "site_owner"],
  })
  role: "admin" | "provincial_official" | "site_owner";

  @ApiProperty({ type: [String], example: ["1", "2", "3"] })
  site_ids: string[];

  @ApiProperty({ type: [String], example: ["1", "2", "3"] })
  province_ids: string[];

  @ApiProperty({ type: [String], example: ["1", "2", "3"] })
  permission_ids: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
