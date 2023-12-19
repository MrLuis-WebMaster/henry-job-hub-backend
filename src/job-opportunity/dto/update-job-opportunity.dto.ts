import { PartialType } from '@nestjs/mapped-types';
import { CreateJobOpportunityDto } from './create-job-opportunity.dto';

export class UpdateJobOpportunityDto extends PartialType(
  CreateJobOpportunityDto,
) {}
