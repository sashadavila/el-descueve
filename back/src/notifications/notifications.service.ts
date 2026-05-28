import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, LessThan, MoreThan } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        @InjectRepository(Notification)
        private readonly notificationsRepository: Repository<Notification>,
    ) { }

    async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
        // VERIFICAR DUPLICADOS EN AMBOS ESTADOS (no leídas Y leídas)
        const existingNotification = await this.findExistingNotification(
            createNotificationDto.type,
            createNotificationDto.metadata?.userId
        );

        if (existingNotification) {
            this.logger.warn(`Notificación duplicada evitada: tipo=${createNotificationDto.type}, userId=${createNotificationDto.metadata?.userId}`);
            throw new ConflictException(
                `Ya existe una notificación del tipo "${createNotificationDto.type}" para este usuario. ` +
                `Estado actual: ${existingNotification.status}`
            );
        }

        const notification = this.notificationsRepository.create(createNotificationDto);
        return this.notificationsRepository.save(notification);
    }

    // Método auxiliar para buscar notificaciones existentes (en cualquier estado)
    private async findExistingNotification(
        type: NotificationType,
        userId?: string
    ): Promise<Notification | null> {
        if (!userId) {
            return this.notificationsRepository.findOne({
                where: { type }
            });
        }

        const allNotificationsOfType = await this.notificationsRepository.find({
            where: { type }
        });

        const existing = allNotificationsOfType.find(notification =>
            notification.metadata?.userId === userId
        );

        return existing || null;
    }

    async findAll(
        status?: NotificationStatus,
        page: number = 1,
        limit: number = 10,
    ): Promise<{ data: Notification[]; total: number; page: number; totalPages: number }> {
        const where: FindOptionsWhere<Notification> = {};

        if (status) {
            where.status = status;
        }

        const [data, total] = await this.notificationsRepository.findAndCount({
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

    async findOne(id: string): Promise<Notification> {
        const notification = await this.notificationsRepository.findOne({
            where: { id },
        });

        if (!notification) {
            throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
        }

        return notification;
    }

    async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
        const notification = await this.findOne(id);
        Object.assign(notification, updateNotificationDto);
        return this.notificationsRepository.save(notification);
    }

    async markAsRead(id: string): Promise<Notification> {
        const notification = await this.findOne(id);
        notification.status = NotificationStatus.READ;
        return this.notificationsRepository.save(notification);
    }

    async markAllAsRead(): Promise<{ count: number }> {
        const result = await this.notificationsRepository.update(
            { status: NotificationStatus.UNREAD },
            { status: NotificationStatus.READ },
        );
        return { count: result.affected || 0 };
    }

    async remove(id: string): Promise<{ message: string }> {
        const notification = await this.findOne(id);

        if (notification.status !== NotificationStatus.READ) {
            throw new Error('No se pueden eliminar notificaciones no leídas. Primero debe marcarlas como leídas.');
        }

        await this.notificationsRepository.remove(notification);
        return { message: `Notificación con ID ${id} eliminada correctamente` };
    }

    async getUnreadCount(): Promise<{ count: number }> {
        const count = await this.notificationsRepository.count({
            where: { status: NotificationStatus.UNREAD },
        });
        return { count };
    }

    // Limpiar notificaciones leídas de más de X días
    async cleanOldNotifications(daysOld: number = 30): Promise<{ count: number; message: string }> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        this.logger.log(`Limpiando notificaciones leídas anteriores a ${cutoffDate.toISOString()}`);

        const result = await this.notificationsRepository.delete({
            status: NotificationStatus.READ,
            createdAt: LessThan(cutoffDate),
        });

        const count = result.affected || 0;
        this.logger.log(`Se eliminaron ${count} notificaciones antiguas`);

        return {
            count,
            message: `Se eliminaron ${count} notificaciones antiguas (mayores a ${daysOld} días)`
        };
    }

    // Generar notificaciones automáticas SIN duplicados
    async generateUserNotifications(users: any[]): Promise<{ created: number; skipped: number; cleaned: number }> {
        this.logger.log(`Iniciando generación de notificaciones para ${users.length} usuarios`);

        // PASO 1: Limpiar notificaciones antiguas
        const cleanResult = await this.cleanOldNotifications(30);

        // PASO 2: Obtener TODAS las notificaciones existentes (para verificar duplicados)
        const allExistingNotifications = await this.notificationsRepository.find();

        const notificationExists = (type: NotificationType, userId: string): boolean => {
            return allExistingNotifications.some(notification =>
                notification.type === type &&
                notification.metadata?.userId === userId
            );
        };

        let created = 0;
        let skipped = 0;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Notificaciones de nuevos usuarios (últimos 7 días)
        const recentUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= sevenDaysAgo;
        });

        for (const user of recentUsers) {
            if (!notificationExists(NotificationType.NEW_USER, user.id)) {
                try {
                    await this.create({
                        title: 'Nuevo usuario registrado',
                        message: `${user.name} se ha registrado en la plataforma`,
                        type: NotificationType.NEW_USER,
                        metadata: {
                            userId: user.id,
                            userName: user.name,
                            userEmail: user.email,
                            userCompany: user.company,
                        },
                        icon: 'person_add',
                        iconColor: 'text-green-500',
                        bgColor: 'bg-green-50',
                        status: NotificationStatus.UNREAD,
                    });
                    created++;
                    this.logger.log(`Notificación creada para nuevo usuario: ${user.name}`);
                } catch (err) {
                    skipped++;
                    this.logger.warn(`Notificación ya existente para: ${user.name}`);
                }
            } else {
                skipped++;
            }
        }

        // Notificaciones de usuarios inactivos
        const inactiveUsers = users.filter(user => !user.isActive);
        for (const user of inactiveUsers) {
            if (!notificationExists(NotificationType.INACTIVE_USER, user.id)) {
                try {
                    await this.create({
                        title: 'Cuenta desactivada',
                        message: `La cuenta de ${user.name} está actualmente desactivada`,
                        type: NotificationType.INACTIVE_USER,
                        metadata: {
                            userId: user.id,
                            userName: user.name,
                            userEmail: user.email,
                        },
                        icon: 'block',
                        iconColor: 'text-red-500',
                        bgColor: 'bg-red-50',
                        status: NotificationStatus.UNREAD,
                    });
                    created++;
                    this.logger.log(`Notificación creada para usuario inactivo: ${user.name}`);
                } catch (err) {
                    skipped++;
                }
            } else {
                skipped++;
            }
        }

        // Notificaciones de administradores
        const adminUsers = users.filter(user => user.role === 'admin' && user.email !== 'admin@eldescuevee.cl');
        for (const user of adminUsers) {
            if (!notificationExists(NotificationType.ADMIN_USER, user.id)) {
                try {
                    await this.create({
                        title: 'Administrador en el sistema',
                        message: `${user.name} tiene permisos de administrador`,
                        type: NotificationType.ADMIN_USER,
                        metadata: {
                            userId: user.id,
                            userName: user.name,
                            userEmail: user.email,
                        },
                        icon: 'admin_panel_settings',
                        iconColor: 'text-purple-500',
                        bgColor: 'bg-purple-50',
                        status: NotificationStatus.UNREAD,
                    });
                    created++;
                    this.logger.log(`Notificación creada para administrador: ${user.name}`);
                } catch (err) {
                    skipped++;
                }
            } else {
                skipped++;
            }
        }

        this.logger.log(`Generación completada: ${created} creadas, ${skipped} omitidas, ${cleanResult.count} limpiadas`);

        return {
            created,
            skipped,
            cleaned: cleanResult.count
        };
    }

    async checkExistingNotification(type: NotificationType, userId: string): Promise<{ exists: boolean; status?: string }> {
        const notification = await this.findExistingNotification(type, userId);

        if (notification) {
            return { exists: true, status: notification.status };
        }

        return { exists: false };
    }
}