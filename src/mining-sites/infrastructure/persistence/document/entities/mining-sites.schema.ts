import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
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
  siteName: string;

  @Prop({ required: true, type: String })
  ownerUserId: string;

  @Prop({ required: true, type: String })
  provinceId: string;

  @Prop({ required: false, type: String })
  boundaryPolygon: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const MiningSitesSchema = SchemaFactory.createForClass(
  MiningSitesSchemaClass,
);
