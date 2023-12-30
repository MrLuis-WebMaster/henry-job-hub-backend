import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { JobOpportunity } from './jobOpportunity.schema';

export enum ReportReason {
  SPAM = 'spam',
  FRAUD = 'fraud',
  INAPPROPRIATE = 'inappropriate',
  MISSING_JOB_DETAILS = 'missing-job-details',
  CLOSED_JOB = 'closed-job',
  MISLEADING = 'misleading',
  DUPLICATE_JOB = 'duplicate-job',
  EXPIRED_JOB = 'expired-job',
}

@Schema()
export class JobReport extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: JobOpportunity.name,
    required: true,
  })
  jobId: string;

  @Prop({ required: true, enum: Object.values(ReportReason) })
  reason: string;

  @Prop({ default: false })
  resolved: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const JobReportSchema = SchemaFactory.createForClass(JobReport);
