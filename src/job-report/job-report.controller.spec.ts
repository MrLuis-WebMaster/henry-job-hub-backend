import { Test, TestingModule } from '@nestjs/testing';
import { JobReportController } from './job-report.controller';

describe('JobReportController', () => {
  let controller: JobReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobReportController],
    }).compile();

    controller = module.get<JobReportController>(JobReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
