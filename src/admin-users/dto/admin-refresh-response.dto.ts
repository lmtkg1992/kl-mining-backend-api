import { ApiProperty } from "@nestjs/swagger";

export class AdminRefreshResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;
}
