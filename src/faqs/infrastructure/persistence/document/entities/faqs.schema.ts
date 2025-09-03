import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type FaqsSchemaDocument = HydratedDocument<FaqsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class FaqsSchemaClass extends EntityDocumentHelper {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;

  @Prop({ required: false })
  image_url?: string;

  @Prop({ required: false, default: 0 })
  order?: number;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const FaqsSchema = SchemaFactory.createForClass(FaqsSchemaClass);
