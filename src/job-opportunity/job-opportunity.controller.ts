import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { JobOpportunityService } from './job-opportunity.service';
import {
  JobOpportunityDto,
  UpdateJobOpportunityDto,
} from 'src/dto/jobOpportunity.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { SortingParams, Sorting } from './decorators/sorting.decorator';
import { Filtering, FilteringParams } from './decorators/filter.decorator';
import { Role } from 'src/auth/decorators/role.decorator';
import { PaginationOptions } from 'src/utils/pagination/interface/pagination.interface';
import { PaginationParams } from 'src/utils/pagination/decorators/pagination.decorator';

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
    @PaginationParams() pagination: PaginationOptions,
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
      return this.jobOpportunityService.findAll(pagination, true);
    }

    return this.jobOpportunityService.filterAndFind(
      sort,
      filter,
      pagination,
      true,
    );
  }

  @Role('admin')
  @Get('/pending-jobs')
  findAllPendingJobs(
    @PaginationParams() pagination: PaginationOptions,
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
      return this.jobOpportunityService.findAll(pagination, false);
    }

    return this.jobOpportunityService.filterAndFind(
      sort,
      filter,
      pagination,
      false,
    );
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

  @Role('admin')
  @Put('/update-job/:id')
  updateAdmin(
    @Param('id') id: string,
    @Body() updateJobOpportunityDto: UpdateJobOpportunityDto,
  ) {
    return this.jobOpportunityService.update(id, updateJobOpportunityDto);
  }

  @Role('admin')
  @Delete('/delete-job/:id')
  deleteJobByAdmin(@Param('id') id: string) {
    return this.jobOpportunityService.delete(id);
  }

  @Public()
  @Get('/filter/options')
  getFilterOptions() {
    return this.jobOpportunityService.getFilterOptions();
  }

  @Post('/saved/job/:jobId')
  savedJob(@Req() req: any, @Param('jobId') jobId: string) {
    return this.jobOpportunityService.saveJob(req.user.id, jobId);
  }

  @Delete('/delete-saved/job/:jobId')
  deleteSavedJob(@Req() req: any, @Param('jobId') jobId: string) {
    return this.jobOpportunityService.deleteJobSaved(req.user.id, jobId);
  }

  @Get('/saved/favorite/:jobId')
  isJobSavedAsFavorite(@Req() req: any, @Param('jobId') jobId: string) {
    return this.jobOpportunityService.isJobSavedAsFavorite(req.user.id, jobId);
  }

  @Get('/saved/jobs')
  getSavedJobs(
    @Req() req: any,
    @PaginationParams() pagination: PaginationOptions,
  ) {
    return this.jobOpportunityService.getSavedJobs(req.user.id, pagination);
  }

  @Get('/created/user')
  getJobsCreatedByUser(
    @Req() req: any,
    @PaginationParams() pagination: PaginationOptions,
  ) {
    return this.jobOpportunityService.findCreatedByUser(
      req.user.id,
      pagination,
    );
  }
}
