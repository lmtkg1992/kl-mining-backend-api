import { ApiProperty } from "@nestjs/swagger";

export class Alerts {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({
    description: "Alert category: breach, truck, after_hours, etc.",
  })
  type: string;

  @ApiProperty({ description: "Title of the alert" })
  title: string;

  @ApiProperty({ description: "Detailed message/description" })
  description: string;

  @ApiProperty({ description: "Associated mining site ID" })
  site_id: string;

  @ApiProperty({ description: "Alert severity level: info, warning, critical" })
  severity: string;

  @ApiProperty({
    description: "Whether alert is resolved or active",
    default: false,
  })
  resolved: boolean;

  @ApiProperty({
    description: "Optional truck ID for truck-related alerts",
    required: false,
  })
  truck_id?: string;

  @ApiProperty({ description: "Timestamp when the alert occurred" })
  timestamp: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
