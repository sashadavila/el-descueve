// src/notifications/notifications.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseUUIDPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationStatus, NotificationType } from './entities/notification.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    @ApiOperation({ summary: 'Crear una nueva notificación' })
    @ApiResponse({ status: 201, description: 'Notificación creada correctamente.' })
    async create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
        return this.notificationsService.create(createNotificationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las notificaciones con paginación' })
    @ApiQuery({ name: 'status', required: false, enum: NotificationStatus })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    async findAll(
        @Query('status') status?: NotificationStatus,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        return this.notificationsService.findAll(
            status,
            parseInt(page),
            parseInt(limit),
        );
    }

    @Get('unread/count')
    @ApiOperation({ summary: 'Obtener cantidad de notificaciones no leídas' })
    @ApiResponse({ status: 200, description: 'Cantidad obtenida correctamente.' })
    async getUnreadCount() {
        return this.notificationsService.getUnreadCount();
    }

    @Get('stats/summary')
    @ApiOperation({ summary: 'Obtener estadísticas de notificaciones por tipo' })
    @ApiResponse({ status: 200, description: 'Estadísticas obtenidas correctamente.' })
    async getStats() {
        return this.notificationsService.getStatsByType();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una notificación por ID' })
    @ApiResponse({ status: 200, description: 'Notificación encontrada correctamente.' })
    @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
        return this.notificationsService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una notificación' })
    @ApiResponse({ status: 200, description: 'Notificación actualizada correctamente.' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateNotificationDto: UpdateNotificationDto,
    ): Promise<Notification> {
        return this.notificationsService.update(id, updateNotificationDto);
    }

    @Put(':id/read')
    @ApiOperation({ summary: 'Marcar notificación como leída' })
    @ApiResponse({ status: 200, description: 'Notificación marcada como leída correctamente.' })
    async markAsRead(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
        return this.notificationsService.markAsRead(id);
    }

    @Put('actions/mark-all-read')
    @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
    @ApiResponse({ status: 200, description: 'Notificaciones marcadas como leídas correctamente.' })
    async markAllAsRead(): Promise<{ count: number }> {
        return this.notificationsService.markAllAsRead();
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una notificación (solo si está LEÍDA)' })
    @ApiResponse({ status: 200, description: 'Notificación eliminada correctamente.' })
    @ApiResponse({ status: 400, description: 'No se puede eliminar notificación no leída.' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        return this.notificationsService.remove(id);
    }

    @Post('actions/generate')
    @ApiOperation({ summary: 'Generar notificaciones automáticas de usuarios' })
    @ApiResponse({ status: 200, description: 'Notificaciones generadas correctamente.' })
    async generateNotifications(@Body('users') users: any[]): Promise<{ created: number; skipped: number; cleaned: number; message: string }> {
        const result = await this.notificationsService.generateUserNotifications(users);
        return {
            ...result,
            message: `✅ Notificaciones actualizadas: ${result.created} nuevas, ${result.skipped} omitidas (ya existían), ${result.cleaned} eliminadas (antiguas >30 días)`
        };
    }

    @Post('actions/generate-inventory')
    @ApiOperation({ summary: 'Generar notificaciones automáticas de inventario (stock bajo y agotados)' })
    @ApiResponse({ status: 200, description: 'Notificaciones de inventario generadas correctamente.' })
    async generateInventoryNotifications(
        @Body('products') products: any[],
        @Body('threshold') threshold: number = 10
    ): Promise<{ created: number; skipped: number; cleaned: number; message: string }> {
        const result = await this.notificationsService.generateInventoryNotifications(products, threshold);
        return {
            ...result,
            message: `✅ Notificaciones de inventario actualizadas: ${result.created} nuevas, ${result.skipped} omitidas, ${result.cleaned} eliminadas (antiguas >30 días)`
        };
    }

    @Delete('actions/clean-old')
    @ApiOperation({ summary: 'Limpiar notificaciones antiguas (más de 30 días leídas)' })
    @ApiResponse({ status: 200, description: 'Notificaciones antiguas eliminadas.' })
    async cleanOldNotifications(@Query('days') days: string = '30'): Promise<{ count: number; message: string }> {
        return this.notificationsService.cleanOldNotifications(parseInt(days));
    }


    @Post('actions/generate-orders')
    @ApiOperation({ summary: 'Generar notificaciones automáticas de pedidos' })
    @ApiResponse({ status: 200, description: 'Notificaciones de pedidos generadas correctamente.' })
    async generateOrderNotifications(
        @Body('orders') orders: any[]
    ): Promise<{ created: number; skipped: number; cleaned: number; message: string }> {
        const result = await this.notificationsService.generateOrderNotifications(orders);
        return {
            ...result,
            message: `✅ Notificaciones de pedidos actualizadas: ${result.created} nuevas, ${result.skipped} omitidas (ya existían), ${result.cleaned} eliminadas (antiguas >30 días)`
        };
    }
}