import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Подтверждение регистрации',
      text: `Подтвердите регистрацию по ссылке: https://some.com?code=${code}`,
      html: `<a href="https://some.com?code=${code}">Подтвердить регистрацию</a>`,
    });
  }

  async sendRecoveryEmail(email: string, recoveryCode: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Восстановление пароля',
      text: `Восстановите пароль по ссылке: https://some.com/recover?code=${recoveryCode}`,
      html: `<a href="https://some.com/recover?code=${recoveryCode}">Восстановить пароль</a>`,
    });
  }
}
