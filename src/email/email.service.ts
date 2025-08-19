import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Users } from '@prisma/client'

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }
  async sendMail(user: Users) {
    const url = `${process.env.API_HOST}/api/users/activate/${user.emailVerificationToken}`;
    const currentYear = new Date().getFullYear()
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome to Inventra!",
      template: "confirmation",
      context: {
        name: user.email,
        url,
        currentYear
      },
    });
  }
}