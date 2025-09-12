import { ApiProperty } from "@nestjs/swagger";

export class RoleDistributionItemDto {
  @ApiProperty()
  role: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  percentage: number;
}

export class ProvinceDistributionItemDto {
  @ApiProperty()
  province: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  percentage: number;
}

export class AdminUsersSummaryDto {
  @ApiProperty({ type: [RoleDistributionItemDto] })
  role_distribution: RoleDistributionItemDto[];

  @ApiProperty({ type: [ProvinceDistributionItemDto] })
  provincial_distribution: ProvinceDistributionItemDto[];
}