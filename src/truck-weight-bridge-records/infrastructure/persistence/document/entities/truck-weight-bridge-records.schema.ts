import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type TruckWeightBridgeRecordsSchemaDocument =
  HydratedDocument<TruckWeightBridgeRecordsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class TruckWeightBridgeRecordsSchemaClass extends EntityDocumentHelper {
  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const TruckWeightBridgeRecordsSchema = SchemaFactory.createForClass(
  TruckWeightBridgeRecordsSchemaClass,
);
