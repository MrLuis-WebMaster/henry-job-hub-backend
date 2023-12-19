import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

export enum Careers {
  FullStack = 'FullStack',
  DataScience = 'Data Science',
}

export enum Mode {
  Hibrido = 'Hibrido',
  Remoto = 'Remoto',
  Presencial = 'Presencial',
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
      message: 'Numero debe tener como maximo dos elementos',
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

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;
}

export const JobOpportunitySchema =
  SchemaFactory.createForClass(JobOpportunity);
