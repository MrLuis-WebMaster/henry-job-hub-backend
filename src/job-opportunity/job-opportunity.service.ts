import { Injectable } from '@nestjs/common';
import { CreateJobOpportunityDto } from './dto/create-job-opportunity.dto';
import { UpdateJobOpportunityDto } from './dto/update-job-opportunity.dto';

@Injectable()
export class JobOpportunityService {
  create(createJobOpportunityDto: CreateJobOpportunityDto) {
    return 'This action adds a new jobOpportunity';
  }

  findAll() {
    return `This action returns all jobOpportunity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobOpportunity`;
  }

  update(id: number, updateJobOpportunityDto: UpdateJobOpportunityDto) {
    return `This action updates a #${id} jobOpportunity`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobOpportunity`;
  }
}
