// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateAiCamerasDto } from "./create-ai-cameras.dto";

export class UpdateAiCamerasDto extends PartialType(CreateAiCamerasDto) {}
