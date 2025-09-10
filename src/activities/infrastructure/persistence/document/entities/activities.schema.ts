import { TrucksSchemaClass } from "../../../../../trucks/infrastructure/persistence/document/entities/trucks.schema";
import { AiCamerasSchemaClass } from "../../../../../ai-cameras/infrastructure/persistence/document/entities/ai-cameras.schema";
import { MiningSitesSchemaClass } from "../../../../../mining-sites/infrastructure/persistence/document/entities/mining-sites.schema";
import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";
import {
  ActivityStatus,
  ActivityPriority,
  ActivityEventType,
} from "../../../../domain/activities";

export type ActivitiesSchemaDocument = HydratedDocument<ActivitiesSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class ActivitiesSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: Number,
  })
  volume?: number | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrucksSchemaClass",
    autopopulate: true,
  })
  truck_id?: TrucksSchemaClass | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "AiCamerasSchemaClass",
    autopopulate: true,
  })
  camera_id?: AiCamerasSchemaClass | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "MiningSitesSchemaClass",
    autopopulate: true,
  })
  site_id: MiningSitesSchemaClass;

  @Prop({
    type: String,
    enum: Object.values(ActivityStatus),
  })
  status: ActivityStatus;

  @Prop({
    type: String,
    enum: Object.values(ActivityPriority),
  })
  priority: ActivityPriority;

  @Prop({
    type: String,
  })
  message: string;

  @Prop({
    type: String,
  })
  title: string;

  @Prop({
    type: String,
    enum: Object.values(ActivityEventType),
  })
  event_type: ActivityEventType;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const ActivitiesSchema = SchemaFactory.createForClass(
  ActivitiesSchemaClass,
);
