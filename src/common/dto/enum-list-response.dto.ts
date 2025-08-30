// src/common/dto/enum-list-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class EnumListItemDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;
}
