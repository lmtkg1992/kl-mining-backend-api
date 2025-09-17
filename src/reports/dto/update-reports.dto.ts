// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateReportsDto } from "./create-reports.dto";

export class UpdateReportsDto extends PartialType(CreateReportsDto) {}
