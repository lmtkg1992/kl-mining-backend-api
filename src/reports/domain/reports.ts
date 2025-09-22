import { ApiProperty } from "@nestjs/swagger";
import { AdminUsers } from "../../admin-users/domain/admin-users";
import { Provinces } from "../../provinces/domain/provinces";
import { MiningSites } from "../../mining-sites/domain/mining-sites";

export enum ReportStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum ReportType {
  CAMERA_PERFORMANCE = "camera_performance",
  BREACH_SUMMARY = "breach_summary",
  TRANSPORT_ACTIVITY = "transport_activity",
  VOLUME_TRACKING = "volume_tracking",
}

export class Reports {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    enum: ReportType,
    nullable: false,
  })
  report_type: ReportType;

  @ApiProperty({
    type: () => MiningSites,
    nullable: true,
  })
  site_id: MiningSites | null;

  @ApiProperty({
    type: () => Provinces,
    nullable: true,
  })
  province_id: Provinces | null;

  @ApiProperty({
    type: Date,
    nullable: false,
  })
  start_date: Date;

  @ApiProperty({
    type: Date,
    nullable: false,
  })
  end_date: Date;

  @ApiProperty({
    type: () => AdminUsers,
    nullable: false,
  })
  generated_by: AdminUsers;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  generated_at: Date;

  @ApiProperty({
    enum: ReportStatus,
    nullable: false,
  })
  status: ReportStatus;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  export_format: string;

  @ApiProperty({
    type: Object,
    nullable: true,
  })
  content_metadata?: any | null;

  @ApiProperty({
    type: Object,
    nullable: true,
  })
  file_metadata?: any | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  file_url?: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  comments?: string | null;

  @ApiProperty({
    type: Object,
    nullable: true,
  })
  report_options?: any | null;

  @ApiProperty({
    type: Object,
    nullable: true,
  })
  snapshots?: any | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
