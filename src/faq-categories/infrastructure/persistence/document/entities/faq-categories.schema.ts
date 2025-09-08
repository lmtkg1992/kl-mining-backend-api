import { FaqsSchemaClass } from "../../../../../faqs/infrastructure/persistence/document/entities/faqs.schema";

import mongoose from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type FaqCategoriesSchemaDocument =
  HydratedDocument<FaqCategoriesSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class FaqCategoriesSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FaqsSchemaClass",
        autopopulate: true,
      },
    ],
  })
  faqs?: FaqsSchemaClass[] | null;

  @Prop({
    type: Number,
  })
  position: number;

  @Prop({
    type: Boolean,
  })
  is_active: boolean;

  @Prop({
    type: String,
  })
  description?: string | null;

  @Prop({
    type: String,
  })
  title: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const FaqCategoriesSchema = SchemaFactory.createForClass(
  FaqCategoriesSchemaClass,
);
