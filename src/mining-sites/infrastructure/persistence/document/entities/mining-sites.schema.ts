import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";
import { AdminUsersSchemaClass } from "src/admin-users/infrastructure/persistence/document/entities/admin-users.schema";
import { MiningSitesSettingsDto } from "../../../../dto/mining-sites-settings.dto";

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
  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: false,
  })
  site_settings?: MiningSitesSettingsDto | null;

  @Prop({
    type: String,
    required: true,
  })
  material_type: string;

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
  boundary_polygon?: string;

  @Prop({ required: false, type: Date })
  last_updated_at?: Date;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop({ required: false, type: Number, default: 0 })
  volume?: number;

  @Prop({ required: false, type: Number, default: 0 })
  trucks?: number;

  @Prop({ required: false, type: Number, default: 0 })
  breaches?: number;

  @Prop({ required: false, type: Number, default: 0 })
  cameras_online?: number;

  @Prop({ required: false, type: Date })
  last_activity?: Date;
}

export const MiningSitesSchema = SchemaFactory.createForClass(
  MiningSitesSchemaClass,
);
