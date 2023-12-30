import { Module } from '@nestjs/common';
import { JobReportService } from './job-report.service';
import { JobReportController } from './job-report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobReport, JobReportSchema } from 'src/schemas/reportJob.schema';
import {
  JobOpportunity,
  JobOpportunitySchema,
} from 'src/schemas/jobOpportunity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobOpportunity.name, schema: JobOpportunitySchema },
      { name: JobReport.name, schema: JobReportSchema },
    ]),
  ],
  providers: [JobReportService],
  controllers: [JobReportController],
})
export class JobReportModule {}
