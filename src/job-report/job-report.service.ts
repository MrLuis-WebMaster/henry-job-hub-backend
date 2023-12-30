import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JobReportDto } from 'src/dto/JobReport.dto';
import { JobOpportunity } from 'src/schemas/jobOpportunity.schema';
import { JobReport, ReportReason } from 'src/schemas/reportJob.schema';
import {
  PaginationInfo,
  PaginationOptions,
} from 'src/utils/pagination/interface/pagination.interface';

@Injectable()
export class JobReportService {
  constructor(
    @InjectModel(JobReport.name)
    private jobReportModel: Model<JobReport>,
    @InjectModel(JobOpportunity.name)
    private jobOpportunityModel: Model<JobOpportunity>,
  ) {}

  async create(
    userId: string,
    jobId: string,
    createJobReportDto: JobReportDto,
  ): Promise<JobReport> {
    try {
      const job = await this.jobOpportunityModel.findById(jobId);

      if (!job) {
        throw new NotFoundException('Job not exists!');
      }

      const jobReport = await this.jobReportModel.findOne({
        userId,
        jobId,
        reason: ReportReason[createJobReportDto.reason],
      });

      if (jobReport) {
        throw new UnauthorizedException('The report already exists');
      }
      const newReportJob = await this.jobReportModel.create({
        userId,
        jobId,
        reason: ReportReason[createJobReportDto.reason],
      });
      return newReportJob;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  async markReportAsResolved(id: string): Promise<JobReport | null> {
    try {
      const objectId = new Types.ObjectId(id);
      const updatedReport = await this.jobReportModel.findOneAndUpdate(
        { _id: objectId },
        { resolved: true },
        { new: true },
      );
      return updatedReport;
    } catch (error) {
      throw new Error('Error updating job report');
    }
  }
  async findAll(
    pagination: PaginationOptions,
  ): Promise<{ data: JobReport[]; pagination: PaginationInfo }> {
    try {
      const { page, pageSize } = pagination;

      const skip = (page - 1) * pageSize;

      const totalDocuments = await this.jobReportModel.countDocuments({
        resolved: false,
      });

      const jobReports = await this.jobReportModel
        .find({ resolved: false })
        .populate({
          path: 'userId',
          select: 'name email lastName',
        })
        .populate('jobId')
        .skip(skip)
        .limit(pageSize)
        .exec();

      const totalPages = Math.ceil(totalDocuments / pageSize);

      const paginationInfo: PaginationInfo = {
        totalDocuments,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };

      const data = {
        data: jobReports,
        pagination: paginationInfo,
      };
      return data;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
