import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";

export type AdminUserGroupsSchemaDocument =
  HydratedDocument<AdminUserGroupsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AdminUserGroupsSchemaClass extends EntityDocumentHelper {
  @Prop({ required: true, trim: true, maxlength: 120 })
  name: string;

  @Prop({ required: true, trim: true })
  status: string;

  @Prop({ trim: true })
  description: string;

  @Prop({
    required: true,
    enum: ["admin", "provincial_official", "site_owner"],
  })
  role: "admin" | "provincial_official" | "site_owner";

  @Prop({ type: String, default: "[]" })
  site_ids: string;

  @Prop({ type: String, default: "[]" })
  province_ids: string;

  @Prop({ type: String, default: "[]" })
  permission_ids: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AdminUserGroupsSchema = SchemaFactory.createForClass(
  AdminUserGroupsSchemaClass,
);
