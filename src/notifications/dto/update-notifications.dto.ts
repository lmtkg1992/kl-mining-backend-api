// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateNotificationsDto } from "./create-notifications.dto";

export class UpdateNotificationsDto extends PartialType(
  CreateNotificationsDto,
) {}
