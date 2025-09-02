// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateAiSnapshotsDto } from "./create-ai-snapshots.dto";

export class UpdateAiSnapshotsDto extends PartialType(CreateAiSnapshotsDto) {}
