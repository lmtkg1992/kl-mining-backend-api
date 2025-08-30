import { ApiProperty } from "@nestjs/swagger";
import { AiCameraFeatureEnum, AiCameraStatusEnum, AiCameraTypeEnum } from "../ai-cameras.enum";
import { MiningSites } from "src/mining-sites/domain/mining-sites";

export class AiCameras {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ type: () => MiningSites })
  site_id: MiningSites;

  @ApiProperty({ enum: AiCameraTypeEnum })
  type: AiCameraTypeEnum;

  @ApiProperty()
  location_description: string;

  @ApiProperty({ enum: AiCameraFeatureEnum, isArray: true })
  ai_features: AiCameraFeatureEnum[];

  @ApiProperty({ enum: AiCameraStatusEnum })
  status: AiCameraStatusEnum;

  @ApiProperty()
  url_live_stream: string;

  @ApiProperty()
  latest_captured_image: string;

  @ApiProperty()
  latest_captured_image_at: Date;

  @ApiProperty()
  installed_at: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
