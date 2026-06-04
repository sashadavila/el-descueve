// src/order-items/dto/create-order-item.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
    @ApiProperty({
        example: 'b7d5f4b2-1e7a-4a12-9a41-123456789abc',
        description: 'ID del producto que se agrega a la orden',
    })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiPropertyOptional({
        example: 2,
        description: 'Cantidad del producto (opcional, si no se envía se usará el minOrder del producto o 1)',
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    quantity?: number;
}