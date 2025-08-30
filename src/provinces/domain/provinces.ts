import { ApiProperty } from "@nestjs/swagger";

export class Provinces {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  province_name: string;

  @ApiProperty()
  province_code: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
