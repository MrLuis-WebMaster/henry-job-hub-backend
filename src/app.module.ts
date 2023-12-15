import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JobOpportunityModule } from './job-opportunity/job-opportunity.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    JobOpportunityModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}