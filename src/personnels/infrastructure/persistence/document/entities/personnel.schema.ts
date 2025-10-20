import { MiningSitesSchemaClass } from '../../../../../mining-sites/infrastructure/persistence/document/entities/mining-sites.schema';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";
import { PersonnelStatus } from "../../../../domain/personnel-status.enum";

export type PersonnelSchemaDocument = HydratedDocument<PersonnelSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class PersonnelSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MiningSitesSchemaClass',
      autopopulate: true,
    }]
  })
  site_ids?: MiningSitesSchemaClass[] | null;

  @Prop({
    type: String,
  })
  phone_number?: string | null;

  @Prop({
    type: String,
  })
  personal_email?: string | null;

  @Prop({
    type: Date,
    required: true,
  })
  date_joined: Date;

  @Prop({
    type: String,
    enum: PersonnelStatus,
    required: true,
  })
  status: PersonnelStatus;

  @Prop({
    type: String,
  })
  department?: string | null;

  @Prop({
    type: String,
    required: true,
  })
  job_title: string;

  @Prop({
    type: String,
  })
  avatar_url?: string | null;

  @Prop({
    type: String,
    required: true,
  })
  full_name: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const PersonnelSchema =
  SchemaFactory.createForClass(PersonnelSchemaClass);