// src/contact-messages/contact-messages.service.ts
import {
    Injectable,
    NotFoundException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage, ContactMessageStatus } from './entities/contact-message.entity';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { RespondMessageDto } from './dto/respond-message.dto';
import { EmailService } from '../common/services/email.service';

@Injectable()
export class ContactMessagesService {
    private readonly logger = new Logger(ContactMessagesService.name);

    constructor(
        @InjectRepository(ContactMessage)
        private readonly contactRepository: Repository<ContactMessage>,
        private readonly emailService: EmailService,
    ) { }

    async create(createDto: CreateContactMessageDto): Promise<ContactMessage> {
        const message = this.contactRepository.create(createDto);
        const saved = await this.contactRepository.save(message);

        this.logger.log(`📧 Nuevo mensaje de contacto de ${saved.name} (${saved.email})`);

        // Enviar email al administrador
        await this.sendAdminNotification(saved);

        // Enviar email de confirmación al usuario
        await this.sendUserConfirmation(saved);

        return saved;
    }

    async findAll(
        status?: ContactMessageStatus,
        page: number = 1,
        limit: number = 20,
    ): Promise<{ data: ContactMessage[]; total: number; page: number; totalPages: number }> {
        const where: any = {};
        if (status) {
            where.status = status;
        }

        const [data, total] = await this.contactRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string): Promise<ContactMessage> {
        const message = await this.contactRepository.findOne({ where: { id } });

        if (!message) {
            throw new NotFoundException(`Mensaje de contacto con ID ${id} no encontrado`);
        }

        return message;
    }

    // ✅ NUEVO: Responder mensaje
    async respond(id: string, respondDto: RespondMessageDto): Promise<ContactMessage> {
        const message = await this.findOne(id);

        // Guardar la respuesta
        message.adminResponse = respondDto.response;
        message.status = ContactMessageStatus.RESPONDED;
        message.respondedAt = new Date();

        const updated = await this.contactRepository.save(message);

        this.logger.log(`📧 Mensaje ${id} respondido por administrador`);

        // ✅ Enviar email de respuesta al usuario
        await this.sendUserResponseEmail(updated);

        return updated;
    }

    async updateStatus(id: string, updateDto: UpdateContactMessageDto): Promise<ContactMessage> {
        const message = await this.findOne(id);

        if (updateDto.status) {
            message.status = updateDto.status;
            if (updateDto.status === ContactMessageStatus.RESPONDED) {
                message.respondedAt = new Date();
            }
        }

        if (updateDto.adminNotes) {
            message.adminNotes = updateDto.adminNotes;
        }

        return this.contactRepository.save(message);
    }

    async remove(id: string): Promise<{ message: string }> {
        const message = await this.findOne(id);
        await this.contactRepository.remove(message);
        this.logger.log(`🗑️ Mensaje de contacto eliminado: ${message.id}`);
        return { message: `Mensaje con ID ${id} eliminado correctamente` };
    }

    async getStats(): Promise<{
        total: number;
        pending: number;
        read: number;
        responded: number;
        archived: number;
    }> {
        const total = await this.contactRepository.count();
        const pending = await this.contactRepository.count({ where: { status: ContactMessageStatus.PENDING } });
        const read = await this.contactRepository.count({ where: { status: ContactMessageStatus.READ } });
        const responded = await this.contactRepository.count({ where: { status: ContactMessageStatus.RESPONDED } });
        const archived = await this.contactRepository.count({ where: { status: ContactMessageStatus.ARCHIVED } });

        return { total, pending, read, responded, archived };
    }

    // ============ MÉTODOS PRIVADOS DE EMAIL ============

    private async sendAdminNotification(message: ContactMessage): Promise<void> {
        const adminEmail = process.env.ADMIN_EMAIL || 'contacto@eldescuevee.cl';

        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; }
        .header { background: #00265b; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -30px -30px 20px; }
        .header h1 { color: white; margin: 0; }
        .field { margin-bottom: 12px; }
        .label { font-weight: bold; color: #00265b; }
        .message-box { background: #f8f9ff; padding: 15px; border-left: 4px solid #FC9430; margin: 15px 0; }
        .tracking-id { background: #e5eeff; padding: 10px; border-radius: 4px; font-family: monospace; text-align: center; font-size: 18px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📩 Nuevo Mensaje de Contacto</h1>
        </div>
        <div class="field"><span class="label">Nombre:</span> ${message.name}</div>
        <div class="field"><span class="label">Email:</span> ${message.email}</div>
        ${message.phone ? `<div class="field"><span class="label">Teléfono:</span> ${message.phone}</div>` : ''}
        ${message.company ? `<div class="field"><span class="label">Empresa:</span> ${message.company}</div>` : ''}
        <div class="field"><span class="label">Asunto:</span> ${message.subject}</div>
        <div class="message-box">
            <div class="label">Mensaje:</div>
            <p style="white-space: pre-wrap;">${message.message}</p>
        </div>
        <div class="field"><span class="label">ID del Mensaje:</span> <code>${message.id}</code></div>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">Puedes gestionar este mensaje desde el panel de administración.</p>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/mensajes/directorio" style="color: #FC9430;">Ir al panel de mensajes</a>
        </p>
    </div>
</body>
</html>
        `;

        await this.emailService.sendEmail({
            to: adminEmail,
            subject: `📩 Nuevo mensaje de contacto: ${message.subject}`,
            html,
        });
    }

    private async sendUserConfirmation(message: ContactMessage): Promise<void> {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; }
        .header { background: #00265b; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -30px -30px 20px; }
        .header h1 { color: white; margin: 0; }
        .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
        .message-box { background: #f8f9ff; padding: 15px; border-left: 4px solid #FC9430; margin: 15px 0; }
        .tracking-id { background: #e5eeff; padding: 10px; border-radius: 4px; font-family: monospace; text-align: center; font-size: 18px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Mensaje Recibido</h1>
        </div>
        <div class="success-icon">📨</div>
        <p>Hola <strong>${message.name}</strong>,</p>
        <p>Hemos recibido tu mensaje correctamente. Nuestro equipo lo revisará y te responderá a la brevedad.</p>

        <div class="message-box">
            <h3 style="margin-top: 0;">Resumen de tu mensaje:</h3>
            <p><strong>Asunto:</strong> ${message.subject}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="white-space: pre-wrap;">${message.message}</p>
        </div>

        <p><strong>ID de seguimiento:</strong></p>
        <div class="tracking-id">${message.id}</div>
        <p style="font-size: 12px; color: #666; margin-top: 10px;">
            Guarda este ID para dar seguimiento a tu mensaje.
        </p>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;" />
        <p style="font-size: 12px; color: #666;">
            El Descuevee SpA · Av. Los Pioneros 1234, La Serena · Chile<br>
            contacto@eldescuevee.cl · +56 51 234 5678
        </p>
    </div>
</body>
</html>
        `;

        await this.emailService.sendEmail({
            to: message.email,
            subject: `✅ Confirmación de mensaje - ${message.subject}`,
            html,
        });
    }

    // ✅ NUEVO: Enviar email de respuesta al usuario
    private async sendUserResponseEmail(message: ContactMessage): Promise<void> {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; }
        .header { background: #00265b; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -30px -30px 20px; }
        .header h1 { color: white; margin: 0; }
        .response-icon { font-size: 48px; text-align: center; margin: 20px 0; }
        .original-message { background: #f8f9ff; padding: 15px; border-left: 4px solid #e0e0e0; margin: 15px 0; }
        .response-box { background: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 15px 0; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📨 Respuesta a tu mensaje</h1>
        </div>
        <div class="response-icon">💬</div>
        <p>Hola <strong>${message.name}</strong>,</p>
        <p>Hemos recibido y procesado tu mensaje. A continuación encontrarás la respuesta de nuestro equipo:</p>

        <div class="response-box">
            <h3 style="margin-top: 0; color: #2e7d32;">📝 Respuesta de El Descuevee</h3>
            <p style="white-space: pre-wrap;">${message.adminResponse}</p>
        </div>

        <div class="original-message">
            <h4 style="margin-top: 0; color: #666;">📩 Tu mensaje original:</h4>
            <p><strong>Asunto:</strong> ${message.subject}</p>
            <p style="white-space: pre-wrap;">${message.message}</p>
        </div>

        <p><strong>ID del mensaje:</strong> <code>${message.id}</code></p>

        <div class="footer">
            <p>Si tienes más preguntas, no dudes en contactarnos nuevamente.</p>
            <p style="margin-top: 10px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/contacto" style="color: #FC9430;">Contactar de nuevo</a>
            </p>
            <hr />
            <p>
                El Descuevee SpA · Av. Los Pioneros 1234, La Serena · Chile<br>
                contacto@eldescuevee.cl · +56 51 234 5678
            </p>
        </div>
    </div>
</body>
</html>
        `;

        await this.emailService.sendEmail({
            to: message.email,
            subject: `📨 Respuesta a tu mensaje: ${message.subject}`,
            html,
        });

        this.logger.log(`📧 Email de respuesta enviado a ${message.email}`);
    }
}