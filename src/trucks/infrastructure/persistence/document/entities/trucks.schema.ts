import { MiningSitesSchemaClass } from "../../../../../mining-sites/infrastructure/persistence/document/entities/mining-sites.schema";

import mongoose from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type TrucksSchemaDocument = HydratedDocument<TrucksSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class TrucksSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: Date,
    required: false,
  })
  last_activity_at?: Date | null;

  @Prop({
    type: Number,
    required: false,
  })
  volume_recorded?: number | null;

  @Prop({
    type: String,
    required: true,
  })
  type: string;

  @Prop({
    type: String,
    enum: ["idle", "loading", "departed", "completed"],
    required: true,
  })
  status: "idle" | "loading" | "departed" | "completed";

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MiningSitesSchemaClass",
        autopopulate: true,
      },
    ],
  })
  site_id: MiningSitesSchemaClass[];

  @Prop({
    type: String,
  })
  driver_name?: string | null;

  @Prop({
    type: String,
  })
  plate_number: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const TrucksSchema = SchemaFactory.createForClass(TrucksSchemaClass);
