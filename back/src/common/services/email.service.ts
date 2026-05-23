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
    private readonly isDevelopment: boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly templatesService: EmailTemplatesService,
    ) {
        // Solo considerar desarrollo si explícitamente está en desarrollo Y no está en producción
        this.isDevelopment = process.env.NODE_ENV === 'development';
        this.initializeTransporter();
    }

    private initializeTransporter() {
        // Obtener configuración de email
        const host = this.configService.get<string>('EMAIL_HOST');
        const port = this.configService.get<number>('EMAIL_PORT');
        const user = this.configService.get<string>('EMAIL_USER');
        const pass = this.configService.get<string>('EMAIL_PASSWORD');

        // Validar que todas las configuraciones existan
        if (!host || !port || !user || !pass) {
            this.logger.error('❌ Configuración de email incompleta. Verifica tus variables de entorno:');
            this.logger.error('   EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD');
            this.logger.error('📧 Los emails NO se enviarán correctamente.');
            return;
        }

        try {
            // CORREGIDO: createTransport en lugar de createTransporter
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465, // true para 465, false para otros puertos
                auth: {
                    user,
                    pass,
                },
                tls: {
                    rejectUnauthorized: false, // Solo para desarrollo, en producción debería ser true
                },
                connectionTimeout: 10000, // 10 segundos
                greetingTimeout: 10000,
            });

            // Verificar conexión
            this.verifyConnection();

            this.logger.log(`📧 Servicio de email inicializado con ${host}:${port}`);
            this.logger.log(`📧 Modo: ${this.isDevelopment ? 'DESARROLLO (mostrando en consola)' : 'PRODUCCIÓN (enviando emails reales)'}`);
        } catch (error) {
            this.logger.error(`❌ Error al inicializar transporter: ${error.message}`);
        }
    }

    private async verifyConnection() {
        if (!this.transporter) return;

        try {
            await this.transporter.verify();
            this.logger.log('✅ Conexión SMTP verificada exitosamente');
        } catch (error) {
            this.logger.error(`❌ Error de conexión SMTP: ${error.message}`);
            this.logger.error('   Verifica tus credenciales de email y que la cuenta permita aplicaciones menos seguras');
        }
    }

    private async sendEmail(options: EmailOptions): Promise<boolean> {
        const from = this.configService.get<string>('EMAIL_FROM') || 'El Descuevee <noreply@eldescuevee.cl>';

        // Modo desarrollo: mostrar en consola Y también intentar enviar si hay transporter
        if (this.isDevelopment) {
            this.logger.log(`=========================================`);
            this.logger.log(`📧 EMAIL SIMULADO (${options.subject})`);
            this.logger.log(`Para: ${options.to}`);
            this.logger.log(`Desde: ${from}`);
            this.logger.log(`Asunto: ${options.subject}`);
            this.logger.log(`Contenido HTML: ${options.html.substring(0, 200)}...`);
            this.logger.log(`=========================================`);

            // Si hay transporter configurado, también intentamos enviar en desarrollo
            if (this.transporter) {
                this.logger.log('📧 Modo desarrollo: También intentando enviar email real...');
                return this.sendRealEmail(options, from);
            }

            return true;
        }

        // Modo producción: enviar email real
        if (!this.transporter) {
            this.logger.error(`❌ No se puede enviar email a ${options.to}: Transporter no inicializado`);
            return false;
        }

        return this.sendRealEmail(options, from);
    }

    private async sendRealEmail(options: EmailOptions, from: string): Promise<boolean> {
        try {
            const info = await this.transporter.sendMail({
                from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                // Cabeceras adicionales para evitar spam
                headers: {
                    'X-Priority': '1',
                    'X-MSMail-Priority': 'High',
                    'X-Mailer': 'El Descuevee Email Service',
                },
            });

            this.logger.log(`✅ Email enviado exitosamente a ${options.to}`);
            this.logger.log(`   Message ID: ${info.messageId}`);
            this.logger.log(`   Response: ${info.response}`);
            return true;
        } catch (error) {
            this.logger.error(`❌ Error al enviar email a ${options.to}: ${error.message}`);
            if (error.code === 'EAUTH') {
                this.logger.error('   Error de autenticación. Verifica tu contraseña de aplicación de Gmail.');
                this.logger.error('   Para Gmail: Usa "Contraseña de aplicación", no tu contraseña normal.');
            }
            return false;
        }
    }

    // 1. Email de bienvenida al registrarse
    async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
        this.logger.log(`📧 Preparando email de bienvenida para: ${data.email}`);
        const html = this.templatesService.getWelcomeEmailTemplate(data);
        return this.sendEmail({
            to: data.email,
            subject: '🎉 Bienvenido a El Descuevee - Ropa Corporativa y Bordado Profesional',
            html,
        });
    }

    // 2. Alerta de inicio de sesión
    async sendLoginAlert(data: LoginAlertData): Promise<boolean> {
        this.logger.log(`📧 Preparando alerta de login para: ${data.email}`);
        const html = this.templatesService.getLoginAlertTemplate(data);
        return this.sendEmail({
            to: data.email,
            subject: '🔐 Alerta de Seguridad - Nuevo inicio de sesión en tu cuenta',
            html,
        });
    }

    // 3. Alerta de cambio de contraseña
    async sendPasswordChangeAlert(data: PasswordChangeAlertData): Promise<boolean> {
        this.logger.log(`📧 Preparando alerta de cambio de contraseña para: ${data.email}`);
        const html = this.templatesService.getPasswordChangeAlertTemplate(data);
        return this.sendEmail({
            to: data.email,
            subject: '🔒 Tu contraseña ha sido actualizada - El Descuevee',
            html,
        });
    }

    // 4. Email de recuperación de contraseña
    async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
        this.logger.log(`📧 Preparando email de recuperación para: ${email}`);
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

    // Método mejorado de recuperación con nombre
    async sendPasswordResetEmailWithName(email: string, name: string, token: string): Promise<boolean> {
        this.logger.log(`📧 Preparando email de recuperación para: ${email} (${name})`);
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