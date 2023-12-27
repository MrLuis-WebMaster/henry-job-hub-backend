import { Test, TestingModule } from '@nestjs/testing';
import { JobReportService } from './job-report.service';

describe('JobReportService', () => {
  let service: JobReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobReportService],
    }).compile();

    service = module.get<JobReportService>(JobReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
