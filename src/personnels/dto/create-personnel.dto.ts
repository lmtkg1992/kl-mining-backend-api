import { MiningSitesDto } from '../../mining-sites/dto/mining-sites.dto';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsDateString,
  IsEmail,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';
import { PersonnelStatus } from '../domain/personnel-status.enum';

export class CreatePersonnelDto {
  @ApiProperty({
    required: false,
    type: () => [MiningSitesDto],
    description: 'Array of mining sites associated with this personnel',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MiningSitesDto)
  @IsArray()
  site_ids?: MiningSitesDto[] | null;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Phone number of the personnel',
  })
  @IsOptional()
  @IsString()
  phone_number?: string | null;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Personal email address of the personnel',
  })
  @IsOptional()
  @IsEmail()
  personal_email?: string | null;

  @ApiProperty({
    required: true,
    type: Date,
    description: 'Date when the personnel joined the company',
  })
  @IsDateString()
  date_joined: Date;

  @ApiProperty({
    required: true,
    enum: PersonnelStatus,
    description: 'Current status of the personnel',
  })
  @IsEnum(PersonnelStatus)
  status: PersonnelStatus;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Department where the personnel works',
  })
  @IsOptional()
  @IsString()
  department?: string | null;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Job title of the personnel',
  })
  @IsString()
  job_title: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'URL of the personnel avatar image',
  })
  @IsOptional()
  @IsString()
  avatar_url?: string | null;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Full name of the personnel',
  })
  @IsString()
  full_name: string;
}