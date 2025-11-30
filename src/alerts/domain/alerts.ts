import { Activities } from "../../activities/domain/activities";
import { AiCameras } from "../../ai-cameras/domain/ai-cameras";
import { Trucks } from "../../trucks/domain/trucks";
import { MiningSites } from "../../mining-sites/domain/mining-sites";
import { ApiProperty } from "@nestjs/swagger";
import { AlertsResolutionDto } from "../dto/alerts-resolution.dto";

export class Alerts {
  @ApiProperty({
    type: () => AlertsResolutionDto,
    nullable: true,
  })
  alerts_resolution?: AlertsResolutionDto | null;

  @ApiProperty({
    type: () => [String],
    nullable: true,
  })
  evidence_url?: string[] | null;

  @ApiProperty({
    type: () => String,
    enum: [
      "unauthorized_access",
      "equipment_tampering",
      "perimeter_breach",
      "restricted_zone_entry",
    ],
    nullable: true,
  })
  breach_type?:
    | "unauthorized_access"
    | "equipment_tampering"
    | "perimeter_breach"
    | "restricted_zone_entry"
    | null;

  @ApiProperty({
    type: () => String,
    enum: ["in", "out"],
    nullable: true,
  })
  direction?: "in" | "out" | null;

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
  })
  overloaded?: boolean | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  fill_level?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  confidence?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  volume?: number | null;

  @ApiProperty({
    type: () => String,
    enum: ["new", "under_review", "acknowledged", "resolved"],
    nullable: false,
  })
  status: "new" | "under_review" | "acknowledged" | "resolved";

  @ApiProperty({
    type: () => String,
    enum: ["low", "medium", "high", "critical"],
    nullable: false,
  })
  severity: "low" | "medium" | "high" | "critical";

  @ApiProperty({
    type: () => Activities,
    nullable: true,
  })
  event_id?: Activities | null;

  @ApiProperty({
    type: () => AiCameras,
    nullable: true,
  })
  camera_id?: AiCameras | null;

  @ApiProperty({
    type: () => String,
    enum: ["dump_truck", "loader", "hauler"],
    nullable: true,
  })
  truck_type?: "dump_truck" | "loader" | "hauler" | null;

  @ApiProperty({
    type: () => Trucks,
    nullable: true,
  })
  truck_id?: Trucks | null;

  @ApiProperty({
    type: () => MiningSites,
    nullable: false,
  })
  site_id: MiningSites;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  timestamp: Date;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  description: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  title: string;

  @ApiProperty({
    type: () => String,
    enum: ["truck_activity", "breach_event"],
    nullable: false,
  })
  alert_type: "truck_activity" | "breach_event";

  @ApiProperty({
    type: () => String,
  })
  id: string;

  @ApiProperty({
    type: () => Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: () => Date,
  })
  updatedAt: Date;
}
