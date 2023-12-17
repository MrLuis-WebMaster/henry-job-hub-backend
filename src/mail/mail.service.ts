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
}
