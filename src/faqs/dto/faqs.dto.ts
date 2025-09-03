import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FaqsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
