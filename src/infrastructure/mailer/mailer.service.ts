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
      <h2 style="color: #007bff;">Bienvenue sur la plateforme <strong>IRFO-ACADEMIC</strong> !</h2>
      <p>Voici votre code à usage unique pour valider votre adresse email :</p>
      <div style="font-size: 32px; color: #28a745; font-weight: bold; margin: 20px 0;">${otp}</div>
      <p>Ce code est valable pendant <strong>5 minutes</strong>.</p>
      <p>Merci de votre confiance.</p>
    `;

    await this.sendEmail(recipient, subject, text, html);
  }

  async sendResetPasswordEmail(recipient: string, code: string): Promise<void> {
    const subject = 'Réinitialisation de votre mot de passe';
    const text = `Voici votre code de réinitialisation : ${code}. Il est valable pendant 10 minutes.`;
    const html = `
      <h2 style="color: #dc3545;">Demande de réinitialisation de mot de passe</h2>
      <p>Voici votre code :</p>
      <div style="font-size: 32px; color: #dc3545; font-weight: bold;">${code}</div>
      <p>Valable pendant <strong>10 minutes</strong>.</p>
    `;

    await this.sendEmail(recipient, subject, text, html);
  }

  private async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"IRFO-ACADEMIC" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      this.logger.log(`Email envoyé à ${to} | ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Échec de l’envoi de l’email à ${to}`, error);
      throw new InternalServerErrorException('Échec de l’envoi de l’email');
       }
  }
}