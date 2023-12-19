import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { JobOpportunityService } from './job-opportunity.service';
import {
  JobOpportunityDto,
  UpdateJobOpportunityDto,
} from 'src/dto/jobOpportunity.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { SortingParams, Sorting } from './decorators/sorting.decorator';
import { Filtering, FilteringParams } from './decorators/filter.decorator';

@Controller('job-opportunity')
export class JobOpportunityController {
  constructor(private readonly jobOpportunityService: JobOpportunityService) {}

  @Post()
  create(@Body() createJobOpportunityDto: JobOpportunityDto) {
    return this.jobOpportunityService.create(createJobOpportunityDto);
  }

  @Public()
  @Get()
  findAll(
    @SortingParams(['country', 'company', 'createdAt']) sort?: Sorting,
    @FilteringParams([
      'country',
      'company',
      'user',
      'yearsOfexperience',
      'mode',
      'createdAt',
    ])
    filter?: Filtering[],
  ) {
    if (!sort && !filter) {
      return this.jobOpportunityService.findAll();
    }

    return this.jobOpportunityService.filterAndFind(sort, filter);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobOpportunityService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobOpportunityDto: UpdateJobOpportunityDto,
  ) {
    return this.jobOpportunityService.update(id, updateJobOpportunityDto);
  }
}
