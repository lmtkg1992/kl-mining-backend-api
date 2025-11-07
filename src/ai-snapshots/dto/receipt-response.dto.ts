import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ReceiptResponseDto {
  @ApiProperty({
    type: String,
    description: "Event ID",
  })
  event_id: string;

  @ApiProperty({
    enum: ["processing", "processed"],
    description: "Processing status",
  })
  status: "processing" | "processed";

  @ApiProperty({
    type: String,
    description: "Received at timestamp",
  })
  received_at: string;

  @ApiProperty({
    type: String,
    description: "Event type",
  })
  event_type: string;

  @ApiProperty({
    enum: ["in", "out"],
    description: "Direction",
  })
  direction: "in" | "out";

  @ApiProperty({
    type: String,
    description: "Plate number",
  })
  plate_number: string;

  @ApiProperty({
    type: String,
    description: "Camera code",
  })
  camera_code: string;

  @ApiPropertyOptional({
    type: Number,
    description: "Confidence score",
  })
  confidence_score?: number;

  @ApiPropertyOptional({
    type: [String],
    description: "List of image URLs uploaded to S3",
  })
  list_image_urls?: string[];
}

