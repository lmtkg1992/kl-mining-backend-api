import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type ProvincesSchemaDocument = HydratedDocument<ProvincesSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class ProvincesSchemaClass extends EntityDocumentHelper {
  @Prop({ required: true, type: String })
  provinceName: string;

  @Prop({ required: true, type: String })
  provinceCode: string;

  @Prop({ required: true, type: String })
  status: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const ProvincesSchema =
  SchemaFactory.createForClass(ProvincesSchemaClass);
