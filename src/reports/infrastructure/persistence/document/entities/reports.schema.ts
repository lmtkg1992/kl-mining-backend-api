import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { now, HydratedDocument } from "mongoose";
import { EntityDocumentHelper } from "../../../../../utils/document-entity-helper";
import { AdminUsersSchemaClass } from '../../../../../admin-users/infrastructure/persistence/document/entities/admin-users.schema';
import { ProvincesSchemaClass } from '../../../../../provinces/infrastructure/persistence/document/entities/provinces.schema';
import { MiningSitesSchemaClass } from '../../../../../mining-sites/infrastructure/persistence/document/entities/mining-sites.schema';
import { ReportStatus, ReportType } from '../../../../domain/reports';

export type ReportsSchemaDocument = HydratedDocument<ReportsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class ReportsSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    enum: ReportType,
    required: true,
  })
  report_type: ReportType;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MiningSitesSchemaClass',
    autopopulate: true,
    required: false,
  })
  site_id: MiningSitesSchemaClass | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProvincesSchemaClass',
    autopopulate: true,
    required: false,
  })
  province_id: ProvincesSchemaClass | null;

  @Prop({
    type: Date,
    required: true,
  })
  start_date: Date;

  @Prop({
    type: Date,
    required: true,
  })
  end_date: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUsersSchemaClass',
    autopopulate: true,
    required: true,
  })
  generated_by: AdminUsersSchemaClass;

  @Prop({
    type: Date,
    required: true,
  })
  generated_at: Date;

  @Prop({
    type: String,
    enum: ReportStatus,
    required: true,
  })
  status: ReportStatus;

  @Prop({
    type: String,
    required: true,
  })
  export_format: string;

  @Prop({
    type: Object,
    required: false,
  })
  content_metadata?: any | null;

  @Prop({
    type: Object,
    required: false,
  })
  file_metadata?: any | null;

  @Prop({
    type: String,
    required: false,
  })
  file_url?: string | null;

  @Prop({
    type: String,
    required: false,
  })
  comments?: string | null;

  @Prop({
    type: Object,
    required: false,
  })
  report_options?: any | null;

  @Prop({
    type: Object,
    required: false,
  })
  snapshots?: any | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const ReportsSchema = SchemaFactory.createForClass(ReportsSchemaClass);
