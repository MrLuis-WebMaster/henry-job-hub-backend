import { Module } from '@nestjs/common';
import { JobOpportunityService } from './job-opportunity.service';
import { JobOpportunityController } from './job-opportunity.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JobOpportunity } from './entities/job-opportunity.entity';
import { JobOpportunitySchema } from 'src/schemas/jobOpportunity.schema';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'JobOpportunity', schema: JobOpportunitySchema }
    ]),
  ],
  controllers: [
    JobOpportunityController
  ],
  providers: [JobOpportunityService],
})
export class JobOpportunityModule {}
