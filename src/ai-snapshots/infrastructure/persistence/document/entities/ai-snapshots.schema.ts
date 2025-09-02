import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type AiSnapshotsSchemaDocument =
  HydratedDocument<AiSnapshotsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AiSnapshotsSchemaClass extends EntityDocumentHelper {
  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AiSnapshotsSchema = SchemaFactory.createForClass(
  AiSnapshotsSchemaClass,
);
