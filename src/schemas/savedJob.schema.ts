import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { JobOpportunity } from './jobOpportunity.schema';

@Schema()
export class SavedJob extends Document {
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
}

export const SavedJobSchema = SchemaFactory.createForClass(SavedJob);
