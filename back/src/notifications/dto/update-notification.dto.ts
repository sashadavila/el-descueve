// src/notifications/dto/update-notification.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { NotificationStatus } from '../entities/notification.entity';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
    @IsOptional()
    @IsEnum(NotificationStatus)
    status?: NotificationStatus;
}