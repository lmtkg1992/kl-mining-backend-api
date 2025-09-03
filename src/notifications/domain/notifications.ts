import { ApiProperty } from "@nestjs/swagger";

export class Notifications {
  @ApiProperty({ type: String })
  id: string;

  // Core event reference
  @ApiProperty({ description: "Event category (breach, truck, camera, report)" })
  event_type: string;

  @ApiProperty({ description: "Unique event identifier" })
  event_id: string;

  @ApiProperty({ description: "Link to event details (UI or API)", required: false })
  event_link?: string;

  // Notification content
  @ApiProperty({ enum: ["breach", "truck", "camera", "report"] })
  type: string;

  @ApiProperty({ description: "Notification title" })
  title: string;

  @ApiProperty({ description: "Notification message content" })
  message: string;

  @ApiProperty({ description: "Associated site ID" })
  site_id: string;

  @ApiProperty({ description: "Associated camera ID", required: false })
  camera_id?: string;

  @ApiProperty({ enum: ["low", "medium", "high", "critical"], default: "medium" })
  priority: string;

  @ApiProperty({ description: "Read/unread status", default: false })
  is_read: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}