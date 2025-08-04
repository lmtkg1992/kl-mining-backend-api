// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateMiningSitesDto } from "./create-mining-sites.dto";

export class UpdateMiningSitesDto extends PartialType(CreateMiningSitesDto) {}
