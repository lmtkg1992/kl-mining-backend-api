// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateFaqCategoriesDto } from "./create-faq-categories.dto";

export class UpdateFaqCategoriesDto extends PartialType(
  CreateFaqCategoriesDto,
) {}
