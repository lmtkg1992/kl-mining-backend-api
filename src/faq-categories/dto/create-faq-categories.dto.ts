import { FaqsDto } from "../../faqs/dto/faqs.dto";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateFaqCategoriesDto {
  @ApiProperty({
    required: false,
    type: () => [FaqsDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FaqsDto)
  @IsArray()
  faqs?: FaqsDto[] | null;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  position: number;

  @ApiProperty({
    required: true,
    type: () => Boolean,
  })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  title: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
