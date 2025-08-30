import { ApiProperty } from "@nestjs/swagger";

export class AdminStatisticsResponseDto {
  @ApiProperty()
  admin_user_id: string;

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
