// src/contact-messages/dto/create-contact-message.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateContactMessageDto {
    @ApiProperty({ example: 'Juan Pérez' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'juan@empresa.cl' })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(150)
    email: string;

    @ApiPropertyOptional({ example: '+56 9 1234 5678' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @ApiPropertyOptional({ example: 'Mi Empresa S.A.' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    company?: string;

    @ApiProperty({ example: 'Cotización de poleras corporativas' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    subject: string;

    @ApiProperty({ example: 'Hola, quisiera cotizar 50 poleras con bordado...' })
    @IsString()
    @IsNotEmpty()
    message: string;
}