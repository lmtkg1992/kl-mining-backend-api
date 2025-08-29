// src/mining-sites/dto/mining-sites-statistics-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class MiningSitesStatisticsResponseDto {
  @ApiProperty()
  siteId: string;

  @ApiProperty()
  lastUpdated: string;

  @ApiProperty({
    example: {
      totalSites: 1,
      operationalSites: 1,
      statusText: "All system operational",
    },
  })
  siteStatus: {
    totalSites: number;
    operationalSites: number;
    statusText: string;
  };

  @ApiProperty({ example: { count: 7, change: -5.1 } })
  breachAlerts: {
    count: number;
    change: number;
  };

  @ApiProperty({ example: { count: 89, change: 12.4 } })
  truckActivities: {
    count: number;
    change: number;
  };

  @ApiProperty({ example: { value: 2150, unit: "m3", percentageQuota: 92 } })
  totalVolume: {
    value: number;
    unit: string;
    percentageQuota: number;
  };
}
