import { ApiProperty } from "@nestjs/swagger";

export class AiCameras {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  site_id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  location_description: string;

  @ApiProperty({ example: ["breach_detection", "truck_monitoring"] })
  ai_features: string[];

  @ApiProperty()
  status: string;

  @ApiProperty()
  installed_at: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
