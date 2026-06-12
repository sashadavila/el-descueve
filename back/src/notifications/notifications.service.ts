// src/notifications/notifications.service.ts
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
        const notification = this.notificationsRepository.create(createNotificationDto);
        return this.notificationsRepository.save(notification);
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

    // Generar notificaciones de inventario (stock bajo y agotados)
    async generateInventoryNotifications(products: any[], threshold: number = 10): Promise<{ created: number; skipped: number; cleaned: number }> {
        this.logger.log(`🔄 Generando notificaciones de inventario para ${products.length} productos (umbral: ${threshold})`);

        // Limpiar notificaciones antiguas (más de 30 días)
        const cleanResult = await this.cleanOldNotifications(30);

        // Obtener todas las notificaciones existentes
        const allExistingNotifications = await this.notificationsRepository.find();

        const notificationExists = (title: string): boolean => {
            return allExistingNotifications.some(notification => notification.title === title);
        };

        let created = 0;
        let skipped = 0;

        // Filtrar productos con stock bajo y agotados
        const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < threshold);
        const outOfStockProducts = products.filter(p => p.stock === 0);

        this.logger.log(`📊 Productos con stock bajo: ${lowStockProducts.length}, agotados: ${outOfStockProducts.length}`);

        // Generar notificaciones para productos con stock bajo
        for (const product of lowStockProducts) {
            const title = `⚠️ Stock bajo: ${product.name}`;

            if (!notificationExists(title)) {
                try {
                    await this.create({
                        title: title,
                        message: `El producto "${product.name}" tiene solo ${product.stock} unidades restantes. Se recomienda reabastecer.`,
                        type: NotificationType.SYSTEM_ALERT,
                        metadata: {
                            productId: product.id,
                            productName: product.name,
                            productReference: product.reference,
                            stock: product.stock,
                            threshold: threshold
                        },
                        icon: 'warning',
                        iconColor: 'text-yellow-500',
                        bgColor: 'bg-yellow-50',
                        status: NotificationStatus.UNREAD,
                    });
                    created++;
                    this.logger.log(`✅ Notificación creada: ${title}`);
                } catch (err) {
                    skipped++;
                    this.logger.warn(`⚠️ Error al crear notificación: ${title}`);
                }
            } else {
                skipped++;
                this.logger.log(`⏭️ Notificación ya existente: ${title}`);
            }
        }

        // Generar notificaciones para productos agotados
        for (const product of outOfStockProducts) {
            const title = `❌ Producto agotado: ${product.name}`;

            if (!notificationExists(title)) {
                try {
                    await this.create({
                        title: title,
                        message: `El producto "${product.name}" está agotado. Se recomienda reabastecer urgentemente.`,
                        type: NotificationType.SYSTEM_ALERT,
                        metadata: {
                            productId: product.id,
                            productName: product.name,
                            productReference: product.reference,
                            stock: 0,
                            threshold: threshold
                        },
                        icon: 'error',
                        iconColor: 'text-red-500',
                        bgColor: 'bg-red-50',
                        status: NotificationStatus.UNREAD,
                    });
                    created++;
                    this.logger.log(`✅ Notificación creada: ${title}`);
                } catch (err) {
                    skipped++;
                    this.logger.warn(`⚠️ Error al crear notificación: ${title}`);
                }
            } else {
                skipped++;
                this.logger.log(`⏭️ Notificación ya existente: ${title}`);
            }
        }

        this.logger.log(`📊 Generación completada: ${created} creadas, ${skipped} omitidas, ${cleanResult.count} limpiadas`);

        return {
            created,
            skipped,
            cleaned: cleanResult.count
        };
    }

    // Generar notificaciones de usuarios (nuevos, inactivos, admins)
    async generateUserNotifications(users: any[]): Promise<{ created: number; skipped: number; cleaned: number }> {
        this.logger.log(`🔄 Generando notificaciones de usuarios para ${users.length} usuarios`);

        // Limpiar notificaciones antiguas
        const cleanResult = await this.cleanOldNotifications(30);

        // Obtener TODAS las notificaciones existentes
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
                    this.logger.log(`✅ Notificación creada para nuevo usuario: ${user.name}`);
                } catch (err) {
                    skipped++;
                    this.logger.warn(`⚠️ Notificación ya existente para: ${user.name}`);
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
                    this.logger.log(`✅ Notificación creada para usuario inactivo: ${user.name}`);
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
                    this.logger.log(`✅ Notificación creada para administrador: ${user.name}`);
                } catch (err) {
                    skipped++;
                }
            } else {
                skipped++;
            }
        }

        this.logger.log(`📊 Generación completada: ${created} creadas, ${skipped} omitidas, ${cleanResult.count} limpiadas`);

        return {
            created,
            skipped,
            cleaned: cleanResult.count
        };
    }

    // Obtener estadísticas de notificaciones por tipo
    async getStatsByType(): Promise<{
        total: number;
        unread: number;
        read: number;
        byType: Record<NotificationType, number>;
    }> {
        const total = await this.notificationsRepository.count();
        const unread = await this.notificationsRepository.count({ where: { status: NotificationStatus.UNREAD } });
        const read = await this.notificationsRepository.count({ where: { status: NotificationStatus.READ } });

        const byType = {
            [NotificationType.NEW_USER]: await this.notificationsRepository.count({ where: { type: NotificationType.NEW_USER } }),
            [NotificationType.INACTIVE_USER]: await this.notificationsRepository.count({ where: { type: NotificationType.INACTIVE_USER } }),
            [NotificationType.ADMIN_USER]: await this.notificationsRepository.count({ where: { type: NotificationType.ADMIN_USER } }),
            [NotificationType.NEW_ORDER]: await this.notificationsRepository.count({ where: { type: NotificationType.NEW_ORDER } }),
            [NotificationType.SYSTEM_ALERT]: await this.notificationsRepository.count({ where: { type: NotificationType.SYSTEM_ALERT } }),
        };

        return { total, unread, read, byType };
    }

    // Generar notificaciones de pedidos
    async generateOrderNotifications(orders: any[]): Promise<{ created: number; skipped: number; cleaned: number }> {
        this.logger.log(`🔄 Generando notificaciones de pedidos para ${orders.length} órdenes`);

        // Limpiar notificaciones antiguas
        const cleanResult = await this.cleanOldNotifications(30);

        // Obtener todas las notificaciones existentes
        const allExistingNotifications = await this.notificationsRepository.find();

        const notificationExists = (title: string): boolean => {
            return allExistingNotifications.some(notification => notification.title === title);
        };

        let created = 0;
        let skipped = 0;

        // Ordenar órdenes por fecha (más recientes primero)
        const sortedOrders = [...orders].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Tomar solo las últimas 50 órdenes para no sobrecargar
        const recentOrders = sortedOrders.slice(0, 50);

        for (const order of recentOrders) {
            const orderIdShort = order.id.slice(-8).toUpperCase();
            let title = '';
            let message = '';
            let icon = '';
            let iconColor = '';
            let bgColor = '';

            // Determinar tipo de notificación según el estado
            if (order.status === 'PENDING') {
                title = `🆕 Nuevo pedido: #${orderIdShort}`;
                message = `Se ha recibido un nuevo pedido por $${(parseFloat(order.total) || 0).toLocaleString()} CLP.`;
                icon = 'receipt_long';
                iconColor = 'text-blue-500';
                bgColor = 'bg-blue-50';
            } else if (order.status === 'PAID') {
                title = `✅ Pedido pagado: #${orderIdShort}`;
                message = `El pedido #${orderIdShort} ha sido pagado y está en preparación.`;
                icon = 'payments';
                iconColor = 'text-green-500';
                bgColor = 'bg-green-50';
            } else if (order.status === 'DELIVERED') {
                title = `📦 Pedido entregado: #${orderIdShort}`;
                message = `El pedido #${orderIdShort} ha sido entregado al cliente.`;
                icon = 'package_2';
                iconColor = 'text-green-600';
                bgColor = 'bg-green-100';
            } else if (order.status === 'CANCELLED') {
                title = `❌ Pedido cancelado: #${orderIdShort}`;
                message = `El pedido #${orderIdShort} ha sido cancelado.`;
                icon = 'cancel';
                iconColor = 'text-red-500';
                bgColor = 'bg-red-50';
            }

            if (title && !notificationExists(title)) {
                try {
                    await this.create({
                        title: title,
                        message: message,
                        type: NotificationType.NEW_ORDER,
                        metadata: {
                            orderId: order.id,
                            orderIdShort: orderIdShort,
                            total: parseFloat(order.total) || 0,
                            status: order.status,
                            userId: order.userId,
                            itemsCount: order.items?.length || 0
                        },
                        icon: icon,
                        iconColor: iconColor,
                        bgColor: bgColor,
                        status: NotificationStatus.UNREAD,
                    });
                    created++;
                    this.logger.log(`✅ Notificación creada: ${title}`);
                } catch (err) {
                    skipped++;
                    this.logger.warn(`⚠️ Error al crear notificación: ${title}`);
                }
            } else {
                skipped++;
            }
        }

        this.logger.log(`📊 Generación completada: ${created} creadas, ${skipped} omitidas, ${cleanResult.count} limpiadas`);

        return {
            created,
            skipped,
            cleaned: cleanResult.count
        };
    }
}