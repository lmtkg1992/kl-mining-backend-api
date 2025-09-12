import { AiCameras } from "../../ai-cameras/domain/ai-cameras";
import { ApiProperty } from "@nestjs/swagger";

export class AiSnapshots {
  @ApiProperty({
    type: () => AiCameras,
    nullable: true,
  })
  camera_id?: AiCameras | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    enum: ["breach", "truck"],
    description: "Detected event classification",
  })
  event_type: "breach" | "truck";

  @ApiProperty({ type: String, description: "Cloud storage path" })
  image_url: string;

  @ApiProperty({
    type: String,
    required: false,
    description: "Truck classification (if event_type = 'truck')",
  })
  truck_type?: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: "AI-estimated fill percentage (if event_type = 'truck')",
  })
  fill_level?: number;

  @ApiProperty({
    type: Number,
    description: "AI detection confidence between 0 and 1",
  })
  confidence_score: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
