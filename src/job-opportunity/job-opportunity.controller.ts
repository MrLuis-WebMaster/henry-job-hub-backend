import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JobOpportunityService } from './job-opportunity.service';
import { CreateJobOpportunityDto } from './dto/create-job-opportunity.dto';
import { UpdateJobOpportunityDto } from './dto/update-job-opportunity.dto';
import { Public } from 'src/auth/decorators/public.decorator';
// import { AuthGuard } from 'src/auth/auth.guard';

// @UseGuards(AuthGuard)

@Controller('job-opportunity')
export class JobOpportunityController {
  constructor(private readonly jobOpportunityService: JobOpportunityService) {}

  // @Public()
  @Post()
  create(@Body() createJobOpportunityDto: CreateJobOpportunityDto) {
    return this.jobOpportunityService.create(createJobOpportunityDto);
  }

  @Get()
  findAll() {
    return this.jobOpportunityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobOpportunityService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobOpportunityService.remove(+id);
  }
}
