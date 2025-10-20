// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreatePersonnelDto } from "./create-personnel.dto";

export class UpdatePersonnelDto extends PartialType(CreatePersonnelDto) {}
