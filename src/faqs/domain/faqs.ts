import { ApiProperty } from "@nestjs/swagger";
import { FaqCategories } from "../../faq-categories/domain/faq-categories";

export class Faqs {
  @ApiProperty({
    type: () => FaqCategories,
    nullable: false,
  })
  categories: FaqCategories;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ description: "Question text" })
  question: string;

  @ApiProperty({ description: "Answer text, supports markdown/HTML" })
  answer: string;

  @ApiProperty({
    description: "Optional image or screenshot URL",
    required: false,
  })
  image_url?: string;

  @ApiProperty({
    description: "Display order for sorting FAQs",
    required: false,
  })
  order?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
