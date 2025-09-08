// src/mining-sites/dto/mining-sites-statistics-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class MiningSitesStatisticsResponseDto {
  @ApiProperty()
  site_id: string;

  @ApiProperty()
  last_updated: string;

  @ApiProperty({
    example: {
      total_sites: 1,
      operational_sites: 1,
      status_text: "All system operational",
    },
  })
  site_status: {
    total_sites: number;
    operational_sites: number;
    status_text: string;
  };

  @ApiProperty({ example: { active: 8, total: 10, needing_maintenance: 2, offline: 2, status_text: "8/10 active — 2 need maintenance" } })
  active_cameras: {
    active: number;
    total: number;
    needing_maintenance: number;
    offline: number;
    status_text: string;
  };

  @ApiProperty({ example: { count: 7, change: -5.1 } })
  breach_alerts: {
    count: number;
    change: number;
  };

  @ApiProperty({ example: { count: 89, change: 12.4 } })
  truck_activities: {
    count: number;
    change: number;
  };

  @ApiProperty({ example: { value: 2150, unit: "m3", percentage_quota: 92 } })
  total_volume: {
    value: number;
    unit: string;
    percentage_quota: number;
  };
}
