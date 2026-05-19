import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    async sendPasswordResetEmail(email: string, token: string): Promise<void> {
        const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

        // Simular envío de email
        this.logger.log(`=========================================`);
        this.logger.log(`📧 ENVÍO DE EMAIL SIMULADO`);
        this.logger.log(`Para: ${email}`);
        this.logger.log(`Asunto: Recuperación de contraseña - El Descuevee`);
        this.logger.log(`Mensaje: Has solicitado restablecer tu contraseña.`);
        this.logger.log(`URL: ${resetUrl}`);
        this.logger.log(`=========================================`);

        // En producción, aquí iría la integración con Nodemailer, SendGrid, etc.
        // Ejemplo con nodemailer:
        // await this.transporter.sendMail({
        //     to: email,
        //     subject: 'Recuperación de contraseña - El Descuevee',
        //     html: `<a href="${resetUrl}">Click aquí para restablecer tu contraseña</a>`,
        // });

        return Promise.resolve();
    }
}