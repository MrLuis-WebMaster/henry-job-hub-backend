import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { JobReportService } from './job-report.service';
import { JobReportDto } from 'src/dto/JobReport.dto';
import { Role } from 'src/auth/decorators/role.decorator';
import { PaginationParams } from 'src/utils/pagination/decorators/pagination.decorator';
import { PaginationOptions } from 'src/utils/pagination/interface/pagination.interface';

@Controller('job-report')
export class JobReportController {
  constructor(private readonly jobReportService: JobReportService) {}

  @Post(':jobId')
  create(
    @Body() jobReportDto: JobReportDto,
    @Param('jobId') jobId: string,
    @Req() req: any,
  ) {
    return this.jobReportService.create(req.user.id, jobId, jobReportDto);
  }
  @Role('admin')
  @Put(':idReport')
  markIsResolved(@Param('idReport') idReport: string) {
    return this.jobReportService.markReportAsResolved(idReport);
  }

  @Role('admin')
  @Get()
  findAll(@PaginationParams() pagination: PaginationOptions) {
    return this.jobReportService.findAll(pagination);
  }
}
