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
import { Notification, NotificationStatus } from './entities/notification.entity';
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
    @ApiResponse({ status: 200, description: 'Lista de notificaciones obtenida correctamente.' })
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
    @ApiOperation({ summary: 'Eliminar una notificación' })
    @ApiResponse({ status: 200, description: 'Notificación eliminada correctamente.' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        return this.notificationsService.remove(id);
    }

    @Post('actions/generate')
    @ApiOperation({ summary: 'Generar notificaciones automáticas basadas en usuarios' })
    @ApiResponse({ status: 200, description: 'Notificaciones generadas correctamente.' })
    async generateNotifications(@Body('users') users: any[]): Promise<{ message: string }> {
        await this.notificationsService.generateUserNotifications(users);
        return { message: 'Notificaciones generadas correctamente' };
    }
}