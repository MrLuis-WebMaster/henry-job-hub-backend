import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  FilterOptionsDto,
  JobOpportunityDto,
  UpdateJobOpportunityDto,
} from '../dto/jobOpportunity.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Careers,
  JobOpportunity,
  Mode,
} from 'src/schemas/jobOpportunity.schema';
import { Model } from 'mongoose';
import { Sorting } from './decorators/sorting.decorator';
import { getSort } from './helpers/sort.helper';
import { Filtering } from './decorators/filter.decorator';
import { getFilters } from './helpers/filter.helper';
import { User } from 'src/schemas/user.schema';
import {
  PaginationInfo,
  PaginationOptions,
} from 'src/utils/pagination/interface/pagination.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SavedJob } from 'src/schemas/savedJob.schema';
import { JobReport } from 'src/schemas/reportJob.schema';

@Injectable()
export class JobOpportunityService {
  constructor(
    @InjectModel(JobOpportunity.name)
    private jobOpportunityModule: Model<JobOpportunity>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(JobReport.name) private jobReportModel: Model<JobReport>,
    @InjectModel(SavedJob.name) private savedJobModel: Model<SavedJob>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    createJobOpportunityDto: JobOpportunityDto,
  ): Promise<JobOpportunity> {
    try {
      const { user: id } = createJobOpportunityDto;

      const user = await this.userModel.findById(id);

      if (!user) {
        throw new UnauthorizedException(
          `The use with id ${user} doesn´t exist`,
        );
      }

      if (user.role === 'admin') {
        const newJobOpportunity = await this.jobOpportunityModule.create({
          ...createJobOpportunityDto,
          visible: true,
        });
        return newJobOpportunity;
      }
      const newJobOpportunity = await this.jobOpportunityModule.create({
        ...createJobOpportunityDto,
        visible: false,
      });
      return newJobOpportunity;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findAll(
    pagination: PaginationOptions,
    visible: boolean,
  ): Promise<{ data: JobOpportunity[]; pagination: PaginationInfo }> {
    try {
      const { page, pageSize } = pagination;

      const skip = (page - 1) * pageSize;

      const totalDocuments = await this.jobOpportunityModule.countDocuments({
        visible,
      });

      const JobOpportunities = await this.jobOpportunityModule
        .find({ visible })
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
        data: JobOpportunities,
        pagination: paginationInfo,
      };
      return data;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async filterAndFind(
    sort?: Sorting,
    filters?: Filtering[],
    pagination?: PaginationOptions,
    visible?: boolean,
  ): Promise<{ data: JobOpportunity[]; pagination: PaginationInfo }> {
    try {
      const { page, pageSize } = pagination;
      const order: { [key: string]: any } = getSort(sort);
      const where = { ...getFilters(filters), visible };
      const skip = (page - 1) * pageSize;

      const totalDocuments =
        await this.jobOpportunityModule.countDocuments(where);

      const JobOpportunities = await this.jobOpportunityModule
        .find(where)
        .sort(order)
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
        data: JobOpportunities,
        pagination: paginationInfo,
      };
      return data;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findOne(id: string): Promise<JobOpportunity> {
    try {
      const jobOpportunity = await this.jobOpportunityModule.findById(id);

      if (!jobOpportunity) {
        throw new UnauthorizedException('Job doesn´t exist');
      }
      return jobOpportunity;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findCreatedByUser(
    idUser: string,
    pagination: PaginationOptions,
  ): Promise<{ data: JobOpportunity[]; pagination: PaginationInfo }> {
    try {
      const { page, pageSize } = pagination;
      const skip = (page - 1) * pageSize;
      const totalDocuments = await this.jobOpportunityModule.countDocuments({
        user: idUser,
      });
      const jobOpportunities = await this.jobOpportunityModule
        .find({
          user: idUser,
        })
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
        data: jobOpportunities,
        pagination: paginationInfo,
      };
      return data;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async update(
    id: string,
    updateJobOpportunityDto: UpdateJobOpportunityDto,
  ): Promise<JobOpportunity> {
    try {
      const jobOpportunity = await this.jobOpportunityModule.findByIdAndUpdate(
        id,
        updateJobOpportunityDto,
        {
          new: true,
        },
      );

      if (!jobOpportunity) {
        throw new UnauthorizedException('Job doesn´t exist');
      }

      return jobOpportunity;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedJob = await this.jobOpportunityModule
        .findByIdAndDelete(id)
        .exec();

      if (!deletedJob) {
        throw new NotFoundException('Job opportunity not found');
      }

      await this.jobReportModel.deleteMany({ jobId: id }).exec();

      return true;
    } catch (error) {
      throw new NotFoundException('Job opportunity not found');
    }
  }

  async getFilterOptions(): Promise<FilterOptionsDto> {
    const companies = await this.jobOpportunityModule
      .find({ visible: true })
      .select('company')
      .distinct('company')
      .exec();

    const countries = await this.jobOpportunityModule
      .find({ visible: true })
      .select('country')
      .distinct('country')
      .exec();

    const positions = await this.jobOpportunityModule
      .find({ visible: true })
      .select('position')
      .distinct('position')
      .exec();

    const careers: string[] = Object.values(Careers);
    const modes: string[] = Object.values(Mode);

    const data = {
      companies,
      countries,
      positions,
      careers,
      modes,
    };

    return data;
  }

  async saveJob(userId: string, jobId: string): Promise<SavedJob> {
    const savedJob = new this.savedJobModel({ userId, jobId });
    return savedJob.save();
  }

  async deleteJobSaved(userId: string, jobId: string): Promise<boolean> {
    const keyJobSaved = `keyJobSaved-${userId}-${jobId}`;
    const cacheData = await this.cacheManager.get<boolean>(keyJobSaved);
    if (cacheData) {
      await this.cacheManager.del(keyJobSaved);
    }
    const result = await this.savedJobModel
      .findOneAndDelete({ userId, jobId })
      .exec();

    if (!result) {
      throw new NotFoundException('Saved job not found');
    }
    return true;
  }

  async isJobSavedAsFavorite(userId: string, jobId: string): Promise<boolean> {
    try {
      const keyJobSaved = `keyJobSaved-${userId}-${jobId}`;
      const cacheData = await this.cacheManager.get<boolean>(keyJobSaved);
      if (cacheData) return cacheData;
      const savedJob = await this.savedJobModel.findOne({ userId, jobId });
      await this.cacheManager.set(keyJobSaved, savedJob !== null, 1000 * 60);
      return savedJob !== null;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getSavedJobs(
    userId: string,
    paginationOptions: PaginationOptions,
  ): Promise<{ data: JobOpportunity[]; pagination: PaginationInfo }> {
    try {
      const { page, pageSize } = paginationOptions;

      const skip = (page - 1) * pageSize;

      const savedJobs = await this.savedJobModel
        .find({ userId })
        .skip(skip)
        .limit(pageSize)
        .exec();

      const jobIds = savedJobs.map((savedJob) => savedJob.jobId);

      const totalDocuments = await this.jobOpportunityModule.countDocuments({
        _id: { $in: jobIds },
      });

      const jobOpportunities = await this.jobOpportunityModule
        .find({ _id: { $in: jobIds } })
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
        data: jobOpportunities,
        pagination: paginationInfo,
      };
      return data;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
