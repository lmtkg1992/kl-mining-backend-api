import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";
import { AdminUsersSchemaClass } from "../../../../../admin-users/infrastructure/persistence/document/entities/admin-users.schema";

export type AdminUserSettingsSchemaDocument =
  HydratedDocument<AdminUserSettingsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AdminUserSettingsSchemaClass extends EntityDocumentHelper {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: AdminUsersSchemaClass.name, required: true })
  admin_user_id: string;

  @Prop({ default: true })
  security_breach_alerts: boolean;

  @Prop({ default: true })
  truck_detection_alerts: boolean;

  @Prop({ default: true })
  camera_health_alerts: boolean;
  
  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AdminUserSettingsSchema = SchemaFactory.createForClass(
  AdminUserSettingsSchemaClass,
);
