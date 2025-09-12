import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";
import { UserStatusEnum } from "../../../../admin-users.enum";
import { IsEmail } from "class-validator";

export type AdminUsersSchemaDocument = HydratedDocument<AdminUsersSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AdminUsersSchemaClass extends EntityDocumentHelper {
  @Prop({ required: true, type: String })
  @IsEmail()
  email: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String, default: null })
  phone_number?: string | null;

  @Prop({
    required: true,
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;

  @Prop({ required: false, type: String, default: null })
  password?: string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUserGroupsSchemaClass",
    required: true,
  })
  admin_user_group: string;

  @Prop({ required: false, type: Date, default: null })
  last_login_at?: Date | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AdminUsersSchema = SchemaFactory.createForClass(
  AdminUsersSchemaClass,
);
