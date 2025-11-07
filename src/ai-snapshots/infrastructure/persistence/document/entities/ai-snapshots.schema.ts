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

  @Prop({
    required: false,
    type: String,
    unique: false,
    sparse: true,
    description: "AI System-provided unique ID for idempotency",
  })
  event_id?: string;

  @Prop({
    required: true,
    type: String,
    enum: [
      "breach",
      "truck",
      "normal",
      "vehicle_entered",
      "vehicle_exited_loaded_legal",
      "vehicle_exited_loaded_illegal",
      "vehicle_exited_empty",
      "cannot_match_truck_in_db_legal",
      "cannot_match_truck_in_db_illegal",
    ],
  })
  event_type:
    | "breach"
    | "truck"
    | "normal"
    | "vehicle_entered"
    | "vehicle_exited_loaded_legal"
    | "vehicle_exited_loaded_illegal"
    | "vehicle_exited_empty"
    | "cannot_match_truck_in_db_legal"
    | "cannot_match_truck_in_db_illegal";

  @Prop({ required: true, type: String })
  image_url: string;

  @Prop({ required: false, type: String })
  truck_type?: string;

  @Prop({ required: false, type: Number, min: 0, max: 100 })
  fill_level?: number;

  @Prop({ required: true, type: Number, min: 0, max: 1 })
  confidence_score: number;

  @Prop({ required: false, type: String })
  plate_number?: string;

  @Prop({ required: false, type: String })
  camera_code?: string;

  @Prop({ required: false, type: String })
  timestamp?: string;

  @Prop({ required: false, type: String, enum: ["in", "out"] })
  direction?: "in" | "out";

  @Prop({ required: false, type: Number })
  volume?: number;

  @Prop({
    required: false,
    type: String,
    enum: ["processing", "processed"],
    default: "processing",
  })
  status?: "processing" | "processed";

  @Prop({
    required: false,
    type: [String],
    description: "List of image URLs uploaded to S3",
  })
  list_image_urls?: string[];

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AiSnapshotsSchema = SchemaFactory.createForClass(
  AiSnapshotsSchemaClass,
);
