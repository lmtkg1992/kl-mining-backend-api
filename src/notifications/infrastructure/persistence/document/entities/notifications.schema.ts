import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type NotificationsSchemaDocument =
  HydratedDocument<NotificationsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class NotificationsSchemaClass extends EntityDocumentHelper {
  @Prop({ required: true })
  event_type: string;

  @Prop({ required: true })
  event_id: string;

  @Prop({ required: false })
  event_link?: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  site_id: string;

  @Prop({ required: false })
  camera_id?: string;

  @Prop({ required: true })
  priority: string;

  @Prop({ required: true })
  is_read: boolean;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const NotificationsSchema = SchemaFactory.createForClass(
  NotificationsSchemaClass,
);
