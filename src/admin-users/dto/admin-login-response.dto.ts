import { ApiProperty } from "@nestjs/swagger";
import { AdminUsers } from "../domain/admin-users";

export class AdminLoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;

  @ApiProperty({
    type: () => AdminUsers,
  })
  user: AdminUsers;
}
