import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
    @ApiPropertyOptional({
        example: 'PAID',
        description: 'Estado de la orden',
        enum: ['PENDING', 'PAID', 'CANCELLED', 'DELIVERED'],
    })
    @IsOptional()
    @IsString()
    @IsIn(['PENDING', 'PAID', 'CANCELLED', 'DELIVERED'])
    status?: string;
}