import { ApiProperty } from "@nestjs/swagger";

export class Provinces {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  provinceName: string;

  @ApiProperty()
  provinceCode: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
