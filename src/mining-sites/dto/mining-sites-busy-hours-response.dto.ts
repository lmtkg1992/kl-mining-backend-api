import { ApiProperty } from "@nestjs/swagger";

export class MiningSitesBusyHoursResponseDto {
  @ApiProperty()
  site_id: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  range: string;

  @ApiProperty({
    example: {
      labels: ["6AM", "7AM", "8AM", "9AM"],
      truck_entries: [2, 4, 7, 9],
      volume_extracted_tons: [10, 20, 40, 65],
    },
  })
  series: {
    labels: string[];
    truck_entries: number[];
    volume_extracted_tons: number[];
  };

  @ApiProperty({
    example: {
      truck_activity: {
        time: "09:00 AM",
        count: 9,
        label: "9AM",
      },
      extraction: {
        time: "09:00 AM",
        tons: 65,
        label: "9AM",
      },
    },
  })
  peaks: {
    truck_activity: {
      time: string;
      count: number;
      label: string;
    };
    extraction: {
      time: string;
      tons: number;
      label: string;
    };
  };

  @ApiProperty()
  last_updated: string;
}
