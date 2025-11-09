import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

    if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) {
      this.logger.error('Configuration SMTP incomplète dans le fichier .env');
      throw new InternalServerErrorException('Configuration SMTP manquante');
    }

    const port = Number(MAIL_PORT);
    
    const isSecure = port === 465; 

    this.transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port,
      secure: isSecure,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
      tls: {
        
        rejectUnauthorized: false,
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Erreur de connexion SMTP :', error);
      } else {
        this.logger.log('Transporteur SMTP prêt à envoyer des emails');
      }
    });
  }

  async sendOtpEmail(recipient: string, otp: string): Promise<void> {
    const subject = 'Code OTP de vérification';
    const text = `Votre code OTP est : ${otp}. Il est valable pendant 5 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #007bff;">Bienvenue sur la plateforme <strong>IRFO-ACADEMIC</strong> !</h2>
          <p>Voici votre code à usage unique pour valider votre adresse email :</p>
          <div style="font-size: 32px; color: #28a745; font-weight: bold; margin: 20px 0;">${otp}</div>
          <p>Ce code est valable pendant <strong>5 minutes</strong>.</p>
          <p>Merci de votre confiance.</p>
        </div>
      </div>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"IRFO-ACADEMIC" <${process.env.MAIL_USER}>`,
        to: recipient,
        subject,
        text,
        html,
      });
      this.logger.log(`Email OTP envoyé à ${recipient} | ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Échec de l’envoi de l’email à ${recipient}`, error);
      throw new InternalServerErrorException('Échec de l’envoi de l’email');
    }
  }
}
