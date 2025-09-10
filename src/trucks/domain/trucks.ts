import { MiningSites } from "../../mining-sites/domain/mining-sites";
import { ApiProperty } from "@nestjs/swagger";

export class Trucks {
  @ApiProperty({
    type: Date,
    nullable: true,
  })
  last_activity_at?: Date | null;

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  volume_recorded?: number | null;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  type: string;

  @ApiProperty({
    type: String,
    enum: ["idle", "loading", "departed", "completed"],
    nullable: false,
  })
  status: "idle" | "loading" | "departed" | "completed";

  @ApiProperty({
    type: () => [MiningSites],
    nullable: false,
  })
  site_id: MiningSites[];

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  driver_name?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  plate_number: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
