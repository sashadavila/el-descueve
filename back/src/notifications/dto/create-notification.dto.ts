import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { NotificationType, NotificationStatus } from '../entities/notification.entity';

export class CreateNotificationDto {
    @ApiProperty({ example: 'Nuevo usuario registrado' })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ example: 'Fernando se ha registrado en la plataforma' })
    @IsString()
    @IsNotEmpty()
    message!: string;

    @ApiProperty({ enum: NotificationType, example: NotificationType.NEW_USER })
    @IsEnum(NotificationType)
    type!: NotificationType;

    @ApiPropertyOptional({ enum: NotificationStatus, default: NotificationStatus.UNREAD })
    @IsOptional()
    @IsEnum(NotificationStatus)
    status?: NotificationStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    metadata?: any;

    @ApiPropertyOptional({ example: 'person_add' })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiPropertyOptional({ example: 'text-green-500' })
    @IsOptional()
    @IsString()
    iconColor?: string;

    @ApiPropertyOptional({ example: 'bg-green-50' })
    @IsOptional()
    @IsString()
    bgColor?: string;
}