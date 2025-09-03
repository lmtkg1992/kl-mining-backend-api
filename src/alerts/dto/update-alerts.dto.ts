// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateAlertsDto } from "./create-alerts.dto";

export class UpdateAlertsDto extends PartialType(CreateAlertsDto) {}
