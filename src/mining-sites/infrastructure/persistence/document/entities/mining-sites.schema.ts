import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";
import { AdminUsersSchemaClass } from "src/admin-users/infrastructure/persistence/document/entities/admin-users.schema";

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
  site_code: string;

  @Prop({ required: true, type: String })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: AdminUsersSchemaClass.name,
    required: true,
  })
  owner_user_id: string | AdminUsersSchemaClass;

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
