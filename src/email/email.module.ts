import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { EmailService } from "./email.service";

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({

        transport: {
          host: config.get<string>("GMAIL_HOST"),
          secure: false,
          auth: {
            user: config.get<string>("GMAIL_USER"),
            pass: config.get<string>("GMAIL_APP_PASSWORD"),
          },
        },
        defaults: {
          from: `Inventra <${config.get<string>("GMAIL_USER")}>`,
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule { }