// src/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
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
                quantity: 2,  // ← quantity es opcional ahora
            },
        ],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}