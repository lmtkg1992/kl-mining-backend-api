import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TrucksDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
