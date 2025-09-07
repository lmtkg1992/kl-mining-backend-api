import { ApiProperty } from "@nestjs/swagger";

export class Faqs {
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
