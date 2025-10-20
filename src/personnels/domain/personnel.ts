import { MiningSites } from '../../mining-sites/domain/mining-sites';
import { PersonnelStatus } from './personnel-status.enum';
import { ApiProperty } from "@nestjs/swagger";

export class Personnel {
  @ApiProperty({
    type: () => [MiningSites],
    nullable: true,
  })
  site_ids?: MiningSites[] | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  phone_number?: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  personal_email?: string | null;

  @ApiProperty({
    type: Date,
    nullable: false,
  })
  date_joined: Date;

  @ApiProperty({
    enum: PersonnelStatus,
    nullable: false,
  })
  status: PersonnelStatus;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  department?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  job_title: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  avatar_url?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  full_name: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
