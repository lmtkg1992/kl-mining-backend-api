import { AiCamerasSchemaClass } from "../../../../../ai-cameras/infrastructure/persistence/document/entities/ai-cameras.schema";

import mongoose from "mongoose";

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
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "AiCamerasSchemaClass",
    autopopulate: true,
  })
  camera_id?: AiCamerasSchemaClass | null;

  @Prop({ required: true, type: String, enum: ["breach", "truck"] })
  event_type: "breach" | "truck";

  @Prop({ required: true, type: String })
  image_url: string;

  @Prop({ required: false, type: String })
  truck_type?: string;

  @Prop({ required: false, type: Number })
  fill_level?: number;

  @Prop({ required: true, type: Number, min: 0, max: 1 })
  confidence_score: number;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AiSnapshotsSchema = SchemaFactory.createForClass(
  AiSnapshotsSchemaClass,
);
