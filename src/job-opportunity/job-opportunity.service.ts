import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  JobOpportunityDto,
  UpdateJobOpportunityDto,
} from '../dto/jobOpportunity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JobOpportunity } from 'src/schemas/jobOpportunity.schema';
import { Model } from 'mongoose';
import { Sorting } from './decorators/sorting.decorator';
import { getSort } from './helpers/sort.helper';
import { Filtering } from './decorators/filter.decorator';
import { getFilters } from './helpers/filter.helper';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class JobOpportunityService {
  constructor(
    @InjectModel(JobOpportunity.name)
    private jobOpportunityModule: Model<JobOpportunity>,
    @InjectModel(User.name) private userModel: Model<User>,
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

  async findAll(): Promise<JobOpportunity[]> {
    try {
      const JobOpportunities = await this.jobOpportunityModule
        .find({ visible: true })
        .exec();
      return JobOpportunities;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findAllPendingJobs(): Promise<JobOpportunity[]> {
    try {
      const JobOpportunities = await this.jobOpportunityModule
        .find({ visible: false })
        .exec();
      return JobOpportunities;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async filterAndFindPendingJobs(
    sort?: Sorting,
    filters?: Filtering[],
  ): Promise<JobOpportunity[]> {
    try {
      const order: { [key: string]: any } = getSort(sort);
      const where = { ...getFilters(filters), visible: false };
      console.log(where);
      const JobOpportunities = await this.jobOpportunityModule
        .find(where)
        .sort(order)
        .exec();

      return JobOpportunities;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  async filterAndFind(
    sort?: Sorting,
    filters?: Filtering[],
  ): Promise<JobOpportunity[]> {
    try {
      const order: { [key: string]: any } = getSort(sort);
      const where = { ...getFilters(filters), visible: true };
      console.log(where);
      const JobOpportunities = await this.jobOpportunityModule
        .find(where)
        .sort(order)
        .exec();

      return JobOpportunities;
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

  async findCreatedByUser(idUser: string): Promise<JobOpportunity[]> {
    try {
      const jobOpportunities = await this.jobOpportunityModule.find({
        user: idUser,
      });
      return jobOpportunities;
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
}
