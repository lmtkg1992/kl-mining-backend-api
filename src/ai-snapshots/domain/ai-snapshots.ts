import { ApiProperty } from "@nestjs/swagger";

export class AiSnapshots {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String, description: "Source camera reference" })
  camera_id: string;

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
