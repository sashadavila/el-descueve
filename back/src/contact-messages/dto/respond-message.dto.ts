// src/contact-messages/dto/respond-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RespondMessageDto {
    @ApiProperty({
        example: 'Hola Juan, gracias por tu mensaje. El equipo de El Descuevee te responderá a la brevedad...',
        description: 'Respuesta del administrador al mensaje de contacto'
    })
    @IsString()
    @IsNotEmpty()
    response: string;
}