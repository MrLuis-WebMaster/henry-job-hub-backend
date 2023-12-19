import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

export enum Careers {
  FullStack = 'Full Stack',
  DataScience = 'Data Science',
}

export enum Mode {
  Hybrid = 'Hibrido',
  Remote = 'Remoto',
  Presential = 'Presencial',
}

@Schema({ timestamps: true })
export class JobOpportunity extends Document {
  @Prop({ enum: Careers, required: true })
  career: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  company: string;

  @Prop({
    required: true,
    validate: {
      validator: (v: number[]) => v.length <= 2,
      message: 'Number must have a maximum of two elements',
    },
  })
  experience: number[];

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  country: string;

  @Prop({ enum: Mode, required: false, default: null })
  mode: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  visible: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;
}

export const JobOpportunitySchema =
  SchemaFactory.createForClass(JobOpportunity);
