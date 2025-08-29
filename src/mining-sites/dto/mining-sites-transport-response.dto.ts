import { ApiProperty } from "@nestjs/swagger";

export class MiningSitesTransportResponseDto {
  @ApiProperty()
  siteId: string;

  @ApiProperty()
  lastUpdated: string;

  @ApiProperty({
    example: [
      { hour: "6 AM", value: 7.2 },
      { hour: "7 AM", value: 7.5 },
    ],
  })
  hourlyData: { hour: string; value: number }[];

  @ApiProperty({ example: { value: 8.2, unit: "tons" } })
  currentHour: {
    value: number;
    unit: string;
  };

  @ApiProperty({ example: { value: 7.6, unit: "tons/hr" } })
  dailyAverage: {
    value: number;
    unit: string;
  };

  @ApiProperty({ example: { range: "10-12 AM" } })
  peakHours: {
    range: string;
  };

  @ApiProperty({ example: { percentage: 94.3 } })
  efficiency: {
    percentage: number;
  };
}
