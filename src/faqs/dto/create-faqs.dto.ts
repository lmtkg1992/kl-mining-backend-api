import { FaqCategoriesDto } from "../../faq-categories/dto/faq-categories.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsUrl, IsNumber, ValidateNested, IsNotEmptyObject } from "class-validator";
import { Type } from "class-transformer";


export class CreateFaqsDto {
  @ApiProperty({
    required: true,
    type: () => FaqCategoriesDto,
  })
  @ValidateNested()
  @Type(() => FaqCategoriesDto)
  @IsNotEmptyObject()
  categories: FaqCategoriesDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}
