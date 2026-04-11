import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {Resend} from "resend";

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationCodeEmail(to: string, code: string) {
    const html =
      '<p>Hola,</p>' +
      '<p>Alguien ha solicitado una nueva contraseña para la cuenta asociada a este correo.</p>' +
      '<p>No se ha hecho ningun cambio aún.</p>' +
      '<p>Si has sido tú, ingresa este código de verificación en la aplicación:</p>' +
      '<p>' +
      code +
      '</p>' +
      '<br><br><br>' +
      '<p>Este correo se encuentra desatendido.<p/>' +
      '<p>Saludos desde el equipo de seguridad de Valion.</p>';

    const { error } = await this.resend.emails.send({
      from: 'forget-password-valion@aurumtech.cloud',
      to: to,
      subject: 'Restauración de contraseña',
      html: html,
    });

    if (error) {
      throw new InternalServerErrorException({
        message: ['Error al enviar el correo electrónico.'],
        error: 'Internal Server Error',
        statusCode: 500
      });
    }
  }

  async sendAccountVerificationEmail(to: string, validationToken: string) {
    const url = `${process.env.FRONT_DOMAIN}/account-verification/${validationToken}`;

    const html =
      '<p>Hola,</p>' +
      '<p>Gracias por registrarte en Valion. Para activar tu cuenta, haz clic en el siguiente botón:</p>' +
      '<div style="margin: 24px 0;">' +
      '<a style="background: #c2185b; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: 500;" ' +
      'href="' + url + '" target="_blank" rel="noopener noreferrer">Verificar cuenta</a>' +
      '</div>' +
      '<p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>' +
      '<p>' +
      url +
      '</p>' +
      '<br><br><br>' +
      '<p>Este correo se encuentra desatendido.<p/>' +
      '<p>Saludos desde el equipo de seguridad de Valion.</p>';

    const { error } = await this.resend.emails.send({
      from: 'account-verification-valion@aurumtech.cloud',
      to: to,
      subject: 'Verificación de cuenta',
      html: html,
    });

    if (error) {
      throw new InternalServerErrorException({
        message: ['Error al enviar el correo electrónico.'],
        error: 'Internal Server Error',
        statusCode: 500
      });
    }
  }

  async sendQuickStartEmail(to: string, completeProfileToken: string) {
    const url = `${process.env.FRONT_DOMAIN}/complete-profile/${completeProfileToken}`;

    const html =
      '<p>Hola,</p>' +
      '<p>Bienvenido a Valion. Para completar tu registro y activar tu cuenta, haz clic en el siguiente botón:</p>' +
      '<div style="margin: 24px 0;">' +
      '<a style="background: #c2185b; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: 500;" ' +
      'href="' + url + '" target="_blank" rel="noopener noreferrer">Completar perfil</a>' +
      '</div>' +
      '<p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>' +
      '<p>' +
      url +
      '</p>' +
      '<br><br><br>' +
      '<p>Este correo se encuentra desatendido.<p/>' +
      '<p>Saludos desde el equipo de seguridad de Valion.</p>';

    const { error } = await this.resend.emails.send({
      from: 'onboarding-valion@aurumtech.cloud',
      to: to,
      subject: 'Completa tu registro en Valion',
      html: html,
    });

    if (error) {
      throw new InternalServerErrorException({
        message: ['Error al enviar el correo electrónico.'],
        error: 'Internal Server Error',
        statusCode: 500
      });
    }
  }
}