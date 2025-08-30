import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type MiningSitesSchemaDocument =
  HydratedDocument<MiningSitesSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class MiningSitesSchemaClass extends EntityDocumentHelper {
  @Prop({ required: true, type: String })
  site_name: string;

  @Prop({ required: true, type: String })
  status: string;

  @Prop({ required: true, type: String })
  owner_user_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProvincesSchemaClass",
    required: true,
  })
  province: string;

  @Prop({ required: false, type: String })
  boundary_polygon: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const MiningSitesSchema = SchemaFactory.createForClass(
  MiningSitesSchemaClass,
);
