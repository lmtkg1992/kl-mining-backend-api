import { ApiProperty } from "@nestjs/swagger";
import { AdminUsers } from "../../admin-users/domain/admin-users";

export class AdminUserSettings {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: () => AdminUsers })
  admin_user_id: AdminUsers;

  @ApiProperty({ default: true, description: "Enable/disable security breach alerts" })
  security_breach_alerts: boolean;

  @ApiProperty({ default: true, description: "Enable/disable truck detection alerts" })
  truck_detection_alerts: boolean;

  @ApiProperty({ default: true, description: "Enable/disable camera health alerts" })
  camera_health_alerts: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
