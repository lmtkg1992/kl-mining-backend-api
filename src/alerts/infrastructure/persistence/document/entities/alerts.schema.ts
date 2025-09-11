import { ActivitiesSchemaClass } from "../../../../../activities/infrastructure/persistence/document/entities/activities.schema";
import { AiCamerasSchemaClass } from "../../../../../ai-cameras/infrastructure/persistence/document/entities/ai-cameras.schema";
import { TrucksSchemaClass } from "../../../../../trucks/infrastructure/persistence/document/entities/trucks.schema";
import { MiningSitesSchemaClass } from "../../../../../mining-sites/infrastructure/persistence/document/entities/mining-sites.schema";
import mongoose from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type AlertsSchemaDocument = HydratedDocument<AlertsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AlertsSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: [String],
    required: false,
  })
  evidence_url?: string[] | null;

  @Prop({
    type: String,
    enum: [
      "unauthorized_access",
      "equipment_tampering",
      "perimeter_breach",
      "restricted_zone_entry",
    ],
    required: false,
  })
  breach_type?:
    | "unauthorized_access"
    | "equipment_tampering"
    | "perimeter_breach"
    | "restricted_zone_entry"
    | null;

  @Prop({
    type: String,
    enum: ["in", "out"],
    required: false,
  })
  direction?: "in" | "out" | null;

  @Prop({
    type: Boolean,
    required: false,
  })
  overloaded?: boolean | null;

  @Prop({
    type: Number,
    required: false,
  })
  fill_level?: number | null;

  @Prop({
    type: Number,
    required: false,
  })
  confidence?: number | null;

  @Prop({
    type: String,
    enum: ["new", "under_review", "acknowledged", "resolved"],
    required: true,
  })
  status: "new" | "under_review" | "acknowledged" | "resolved";

  @Prop({
    type: String,
    enum: ["low", "medium", "high", "critical"],
    required: true,
  })
  severity: "low" | "medium" | "high" | "critical";

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "ActivitiesSchemaClass",
    autopopulate: true,
    required: false,
  })
  event_id?: ActivitiesSchemaClass | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "AiCamerasSchemaClass",
    autopopulate: true,
    required: false,
  })
  camera_id?: AiCamerasSchemaClass | null;

  @Prop({
    type: String,
    enum: ["dump_truck", "loader", "hauler"],
    required: false,
  })
  truck_type?: "dump_truck" | "loader" | "hauler" | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrucksSchemaClass",
    autopopulate: true,
    required: false,
  })
  truck_id?: TrucksSchemaClass | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "MiningSitesSchemaClass",
    autopopulate: true,
    required: true,
  })
  site_id: MiningSitesSchemaClass;

  @Prop({
    type: Date,
    required: true,
  })
  timestamp: Date;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    enum: ["truck_activity", "breach_event"],
    required: true,
  })
  alert_type: "truck_activity" | "breach_event";

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AlertsSchema = SchemaFactory.createForClass(AlertsSchemaClass);
