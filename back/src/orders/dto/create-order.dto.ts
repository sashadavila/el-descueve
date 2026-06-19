// src/orders/dto/create-order.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreateOrderItemDto } from '../../order-items/dto/create-order-item.dto';

export class CreateOrderDto {
    @ApiProperty({
        example: 'd4e2c96c-9f2d-4ed7-bfb9-123456789abc',
        description: 'ID del usuario que realiza la orden',
    })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: 'Productos incluidos en la orden',
        example: [
            {
                productId: 'b7d5f4b2-1e7a-4a12-9a41-123456789abc',
                quantity: 2,
            },
        ],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    // ✅ NUEVOS CAMPOS DE DIRECCIÓN
    @ApiPropertyOptional({
        example: 'Av. Los Pioneros 1234',
        description: 'Dirección de envío',
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({
        example: 'La Serena',
        description: 'Ciudad de envío',
    })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({
        example: 'Coquimbo',
        description: 'Región de envío',
    })
    @IsOptional()
    @IsString()
    region?: string;

    @ApiPropertyOptional({
        example: '1700000',
        description: 'Código postal',
    })
    @IsOptional()
    @IsString()
    postalCode?: string;

    @ApiPropertyOptional({
        example: 'Entregar en la recepción',
        description: 'Notas adicionales para el envío',
    })
    @IsOptional()
    @IsString()
    notes?: string;
}