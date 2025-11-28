import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class GetSynologyCameraIdDto {
  @ApiProperty({
    description: "Camera code (e.g., TTT-CAM01)",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  camera_code: string;
}

