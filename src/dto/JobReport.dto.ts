import { IsNotEmpty, IsString } from 'class-validator';

export class JobReportDto {
  @IsNotEmpty()
  @IsString()
  reason: string;
}
