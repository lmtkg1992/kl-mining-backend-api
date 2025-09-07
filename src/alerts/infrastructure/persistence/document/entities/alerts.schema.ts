import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type AlertsSchemaDocument = HydratedDocument<AlertsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
})
export class AlertsSchemaClass extends EntityDocumentHelper {
  @Prop({ required: true })
  type: string; // breach, truck, after_hours

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  site_id: string;

  @Prop({
    required: true,
    enum: ["info", "warning", "critical"],
    default: "warning",
  })
  severity: string;

  @Prop({ default: false })
  resolved: boolean;

  @Prop({ required: false })
  truck_id?: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AlertsSchema = SchemaFactory.createForClass(AlertsSchemaClass);
