import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JobOpportunityModule } from './job-opportunity/job-opportunity.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { JobReportModule } from './job-report/job-report.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL, {
      dbName: process.env.DB_NAME,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: (process.env.REDIS_PORT as unknown as number) || 6379,
          },
          username: process.env.REDIS_USERNAME,
          password: process.env.REDIS_PASSWORD,
        }),
      }),
    }),
    JobOpportunityModule,
    AuthModule,
    MailModule,
    JobReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
