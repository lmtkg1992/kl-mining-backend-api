import { Trucks } from "../../trucks/domain/trucks";
import { AiCameras } from "../../ai-cameras/domain/ai-cameras";
import { MiningSites } from "../../mining-sites/domain/mining-sites";
import { ApiProperty } from "@nestjs/swagger";

export enum ActivityStatus {
  NEW = "new",
  ACKNOWLEDGED = "acknowledged",
  RESOLVED = "resolved",
}

export enum ActivityPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum ActivityEventType {
  BREACH_ALERT = "breach_alert",
  TRUCK_DEPARTED = "truck_departed",
  LOADING_COMPLETE = "loading_complete",
  CAMERA_STATUS_CHANGE = "camera_status_change",
}

export class Activities {
  @ApiProperty({
    type: Number,
    nullable: true,
  })
  volume?: number | null;

  @ApiProperty({
    type: () => Trucks,
    nullable: true,
  })
  truck_id?: Trucks | null;

  @ApiProperty({
    type: () => AiCameras,
    nullable: true,
  })
  camera_id?: AiCameras | null;

  @ApiProperty({
    type: () => MiningSites,
    nullable: false,
  })
  site_id: MiningSites;

  @ApiProperty({
    enum: ActivityStatus,
    nullable: false,
  })
  status: ActivityStatus;

  @ApiProperty({
    enum: ActivityPriority,
    nullable: false,
  })
  priority: ActivityPriority;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  message: string;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  title: string;

  @ApiProperty({
    enum: ActivityEventType,
    nullable: false,
  })
  event_type: ActivityEventType;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
