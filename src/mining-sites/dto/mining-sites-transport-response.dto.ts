import { ApiProperty } from "@nestjs/swagger";

export class MiningSitesTransportResponseDto {
  @ApiProperty()
  site_id: string;

  @ApiProperty()
  last_updated: string;

  @ApiProperty({
    example: [
      { hour: "6 AM", value: 7.2 },
      { hour: "7 AM", value: 7.5 },
    ],
  })
  hourly_data: { hour: string; value: number }[];

  @ApiProperty({ example: { value: 8.2, unit: "tons" } })
  current_hour: {
    value: number;
    unit: string;
  };

  @ApiProperty({ example: { value: 7.6, unit: "tons/hr" } })
  daily_average: {
    value: number;
    unit: string;
  };

  @ApiProperty({ example: { range: "10-12 AM" } })
  peak_hours: {
    range: string;
  };

  @ApiProperty({ example: { percentage: 94.3 } })
  efficiency: {
    percentage: number;
  };
}
