// src/contact-messages/dto/update-contact-message.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContactMessageStatus } from '../entities/contact-message.entity';

export class UpdateContactMessageDto {
    @ApiPropertyOptional({ enum: ContactMessageStatus })
    @IsOptional()
    @IsEnum(ContactMessageStatus)
    status?: ContactMessageStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    adminNotes?: string;
}