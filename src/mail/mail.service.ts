import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailConfirmation(email: string, name: string, url: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: '💛 Bienvenido a HenryJobHub - Verificación de Cuenta',
        template: './confirmationEmailAdmin',
        context: {
          name,
          url,
          emailSupport: process.env.EMAIL_SUPPORT,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetTokenUrl: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '🔐 Recuperación de Contraseña - HenryJobHub',
        template: './passwordResetEmail',
        context: {
          name,
          resetTokenUrl,
          emailSupport: process.env.EMAIL_SUPPORT,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendNewsletter(emails: string[], latestJob: any) {
    try {
      await this.mailerService.sendMail({
        to: 'frann.cedd@gmail.com',
        from: process.env.EMAIL_FROM,
        subject: '📰 Newsletter de HenryJobHub',
        template: './newsletterEmail',
        context: {
          career: latestJob.career,
          company: latestJob.company,
          country: latestJob.country,
          mode: latestJob.mode,
          link: latestJob.link,
          emailSupport: process.env.EMAIL_SUPPORT,
        },
      });

      // for (const email of emails) {
      //   await this.mailerService.sendMail({
      //     to: email,
      //     from: process.env.EMAIL_FROM,
      //     subject: '📰 Newsletter de HenryJobHub',
      //     template: './newsletterEmail',
      //     context: {
      //       career: latestJob.career,
      //       company: latestJob.company,
      //       country: latestJob.country,
      //       mode: latestJob.mode,
      //       link: latestJob.link,
      //       emailSupport: process.env.EMAIL_SUPPORT,
      //     },
      //   });
      // }
    } catch (error) {
      console.log(error);
    }
  }
}
