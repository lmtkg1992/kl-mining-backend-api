import { ApiProperty } from "@nestjs/swagger";

export class Permissions {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  method: string;

  @ApiProperty({
    type: String,
  })
  path: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
