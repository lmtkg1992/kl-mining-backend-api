import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsMongoId } from "class-validator";

export class CreateAdminUserSettingsDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  admin_user_id: string;

  @ApiProperty({
    default: true,
    description: "Enable/disable security breach alerts",
  })
  @IsBoolean()
  @IsOptional()
  security_breach_alerts?: boolean;

  @ApiProperty({
    default: true,
    description: "Enable/disable truck detection alerts",
  })
  @IsBoolean()
  @IsOptional()
  truck_detection_alerts?: boolean;

  @ApiProperty({
    default: true,
    description: "Enable/disable camera health alerts",
  })
  @IsBoolean()
  @IsOptional()
  camera_health_alerts?: boolean;
}
