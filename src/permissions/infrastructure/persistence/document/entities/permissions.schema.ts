import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type PermissionsSchemaDocument =
  HydratedDocument<PermissionsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class PermissionsSchemaClass extends EntityDocumentHelper {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  method: string;

  @Prop({ required: true, type: String })
  path: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const PermissionsSchema = SchemaFactory.createForClass(
  PermissionsSchemaClass,
);
