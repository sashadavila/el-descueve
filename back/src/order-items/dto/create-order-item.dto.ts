import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateOrderItemDto {
    @ApiProperty({
        example: 'b7d5f4b2-1e7a-4a12-9a41-123456789abc',
        description: 'ID del producto que se agrega a la orden',
    })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({
        example: 2,
        description: 'Cantidad del producto',
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    quantity: number;
}