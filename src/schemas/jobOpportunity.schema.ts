import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Careers {
    FullStack = 'FullStack',
    DataScience = 'Data Science'

}

export enum Mode {

}

@Schema()
export class JobOpportunity extends Document{

    @Prop({enum: Careers})
    career: string;

    @Prop({required: true})
    category: string

    @Prop({required: true})
    company: string
    
    @Prop({required: true})
    experience: string

    @Prop({required: true})
    position:string

    @Prop({required: true})
    country:string

    @Prop({required: true})
    mode: string

    @Prop({required: true})
    link: string
}

export const JobOpportunitySchema = SchemaFactory.createForClass(JobOpportunity);
