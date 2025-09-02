import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  AiSnapshotsSchema,
  AiSnapshotsSchemaClass,
} from "./entities/ai-snapshots.schema";
import { AiSnapshotsRepository } from "../ai-snapshots.repository";
import { AiSnapshotsDocumentRepository } from "./repositories/ai-snapshots.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiSnapshotsSchemaClass.name, schema: AiSnapshotsSchema },
    ]),
  ],
  providers: [
    {
      provide: AiSnapshotsRepository,
      useClass: AiSnapshotsDocumentRepository,
    },
  ],
  exports: [AiSnapshotsRepository],
})
export class DocumentAiSnapshotsPersistenceModule {}
