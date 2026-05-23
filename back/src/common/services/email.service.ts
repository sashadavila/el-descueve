import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailTemplatesService } from './email-templates.service';
import {
    WelcomeEmailData,
    LoginAlertData,
    PasswordChangeAlertData,
    EmailOptions
} from '../interfaces/email.interface';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;
    private readonly isProduction: boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly templatesService: EmailTemplatesService,
    ) {
        this.isProduction = process.env.NODE_ENV === 'production';
        this.initializeTransporter();
    }

    private initializeTransporter() {
        // Configuración para entorno de desarrollo (logs simulados)
        if (!this.isProduction) {
            this.logger.log('📧 Modo desarrollo: Los emails se mostrarán en consola');
            return;
        }

        // Configuración real para producción
        const host = this.configService.get<string>('EMAIL_HOST');
        const port = this.configService.get<number>('EMAIL_PORT');
        const user = this.configService.get<string>('EMAIL_USER');
        const pass = this.configService.get<string>('EMAIL_PASSWORD');

        if (!host || !user || !pass) {
            this.logger.warn('⚠️ Configuración de email incompleta. Los emails no se enviarán.');
            return;
        }

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
                user,
                pass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        this.logger.log('📧 Servicio de email inicializado correctamente');
    }

    private async sendEmail(options: EmailOptions): Promise<boolean> {
        const from = this.configService.get<string>('EMAIL_FROM') || 'El Descuevee <noreply@eldescuevee.cl>';

        // Modo desarrollo: solo mostrar en consola
        if (!this.isProduction || !this.transporter) {
            this.logger.log(`=========================================`);
            this.logger.log(`📧 EMAIL SIMULADO (${options.subject})`);
            this.logger.log(`Para: ${options.to}`);
            this.logger.log(`Desde: ${from}`);
            this.logger.log(`Asunto: ${options.subject}`);
            this.logger.log(`Contenido HTML: ${options.html.substring(0, 200)}...`);
            this.logger.log(`=========================================`);
            return true;
        }

        // Modo producción: enviar email real
        try {
            const info = await this.transporter.sendMail({
                from,
                to: options.to,
                subject: options.subject,
                html: options.html,
            });

            this.logger.log(`📧 Email enviado a ${options.to} - ID: ${info.messageId}`);
            return true;
        } catch (err) {
            // ✅ CORREGIDO: Tipado correcto del error
            const error = err as Error;
            this.logger.error(`❌ Error al enviar email a ${options.to}: ${error.message}`);
            return false;
        }
    }

    async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
        const html = this.templatesService.getWelcomeEmailTemplate(data);
        return this.sendEmail({
            to: data.email,
            subject: '🎉 Bienvenido a El Descuevee - Ropa Corporativa y Bordado Profesional',
            html,
        });
    }

    async sendLoginAlert(data: LoginAlertData): Promise<boolean> {
        const html = this.templatesService.getLoginAlertTemplate(data);
        return this.sendEmail({
            to: data.email,
            subject: '🔐 Alerta de Seguridad - Nuevo inicio de sesión en tu cuenta',
            html,
        });
    }

    async sendPasswordChangeAlert(data: PasswordChangeAlertData): Promise<boolean> {
        const html = this.templatesService.getPasswordChangeAlertTemplate(data);
        return this.sendEmail({
            to: data.email,
            subject: '🔒 Tu contraseña ha sido actualizada - El Descuevee',
            html,
        });
    }

    async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
        const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

        const html = this.templatesService.getPasswordResetTemplate({
            name: 'Usuario',
            email,
            resetToken: token,
            resetUrl,
        });

        return this.sendEmail({
            to: email,
            subject: '🔑 Recuperación de contraseña - El Descuevee',
            html,
        });
    }

    async sendPasswordResetEmailWithName(email: string, name: string, token: string): Promise<boolean> {
        const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

        const html = this.templatesService.getPasswordResetTemplate({
            name,
            email,
            resetToken: token,
            resetUrl,
        });

        return this.sendEmail({
            to: email,
            subject: '🔑 Recuperación de contraseña - El Descuevee',
            html,
        });
    }
}