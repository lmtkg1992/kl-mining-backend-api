import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type AiCamerasSchemaDocument = HydratedDocument<AiCamerasSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AiCamerasSchemaClass extends EntityDocumentHelper {

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  site_id: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  location_description: string;

  @Prop({ type: [String], default: [] })
  ai_features: string[];

  @Prop({ default: "active" })
  status: string;

  @Prop()
  installed_at: Date;
  
  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AiCamerasSchema =
  SchemaFactory.createForClass(AiCamerasSchemaClass);
