import { Faqs } from "../../faqs/domain/faqs";
import { ApiProperty } from "@nestjs/swagger";

export class FaqCategories {
  @ApiProperty({
    type: () => [Faqs],
    nullable: true,
  })
  faqs?: Faqs[] | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  position: number;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  is_active: boolean;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  title: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
