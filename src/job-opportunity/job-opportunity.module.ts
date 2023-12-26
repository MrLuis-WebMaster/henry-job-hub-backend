import { Module } from '@nestjs/common';
import { JobOpportunityService } from './job-opportunity.service';
import { JobOpportunityController } from './job-opportunity.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobOpportunity,
  JobOpportunitySchema,
} from 'src/schemas/jobOpportunity.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { SavedJob, SavedJobSchema } from 'src/schemas/savedJob.schema';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: JobOpportunity.name, schema: JobOpportunitySchema },
      { name: SavedJob.name, schema: SavedJobSchema },
    ]),
  ],
  controllers: [JobOpportunityController],
  providers: [JobOpportunityService],
})
export class JobOpportunityModule {}
