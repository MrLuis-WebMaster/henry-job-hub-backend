import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Careers, Mode } from 'src/schemas/jobOpportunity.schema';
import { User } from 'src/schemas/user.schema';

@ValidatorConstraint({ name: 'IsFisrtLessThanSecond' })
export class IsFisrtLessThanSecond implements ValidatorConstraintInterface {
  validate(value: number[]): boolean {
    if (value[0] >= value[1]) return false;
    return true;
  }
}

export class JobOpportunityDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.keys(Careers).map((k) => Careers[k]))
  career: string;

  @IsString()
  category: string;

  @IsString()
  company: string;

  @IsArray()
  @ArrayMaxSize(2)
  @Validate(IsFisrtLessThanSecond, {
    message: 'The first element must be less than the second element',
  })
  experience: number[];

  @IsString()
  position: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  @IsIn(Object.keys(Mode).map((k) => Mode[k]))
  mode: string;

  @IsString()
  link: string;

  @IsNotEmpty()
  @IsMongoId()
  user: User;
}

export class UpdateJobOpportunityDto extends PartialType(JobOpportunityDto) {
  @IsOptional()
  career?: string;
  @IsOptional()
  visible?: boolean;
}
