import { AiCameras } from "../../ai-cameras/domain/ai-cameras";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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

  @ApiPropertyOptional({
    type: String,
    description: "AI System-provided unique ID (predict_id); used for idempotency",
  })
  event_id?: string;

  @ApiProperty({
    enum: [
      "breach",
      "truck",
      "normal",
      "vehicle_entered",
      "vehicle_exited_loaded_legal",
      "vehicle_exited_loaded_illegal",
      "vehicle_exited_empty",
      "cannot_match_truck_in_db_legal",
      "cannot_match_truck_in_db_illegal",
    ],
    description: "Detected event classification",
  })
  event_type:
    | "breach"
    | "truck"
    | "normal"
    | "vehicle_entered"
    | "vehicle_exited_loaded_legal"
    | "vehicle_exited_loaded_illegal"
    | "vehicle_exited_empty"
    | "cannot_match_truck_in_db_legal"
    | "cannot_match_truck_in_db_illegal";

  @ApiPropertyOptional({ type: String, description: "Cloud storage path" })
  image_url?: string;

  @ApiPropertyOptional({
    type: String,
    description: "Truck classification (if event_type = 'truck')",
  })
  truck_type?: string;

  @ApiPropertyOptional({
    type: Number,
    description: "AI-estimated fill percentage (0-100)",
  })
  fill_level?: number;

  @ApiProperty({
    type: Number,
    description: "AI detection confidence between 0 and 1",
  })
  confidence_score: number;

  @ApiPropertyOptional({
    type: String,
    description: "Vehicle plate number",
  })
  plate_number?: string;

  @ApiPropertyOptional({
    type: String,
    description: "Source camera identifier",
  })
  camera_code?: string;

  @ApiPropertyOptional({
    type: String,
    description: "ISO-8601 timestamp (prefer UTC Z)",
  })
  timestamp?: string;

  @ApiPropertyOptional({
    enum: ["in", "out", "n/a"],
    description: "Direction: 'in' for enter, 'out' for exit, 'n/a' for non-vehicle events",
  })
  direction?: "in" | "out" | "n/a";

  @ApiPropertyOptional({
    type: Number,
    description: "Volume estimation",
  })
  volume?: number;

  @ApiPropertyOptional({
    type: String,
    description: "Processing status",
  })
  status?: "processing" | "processed";

  @ApiPropertyOptional({
    type: [String],
    description: "List of image URLs uploaded to S3",
  })
  list_image_urls?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
