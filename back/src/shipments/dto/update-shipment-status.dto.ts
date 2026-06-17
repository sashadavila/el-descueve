// src/shipments/dto/update-shipment-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ShipmentStatus } from '../entities/shipment.entity';

export class UpdateShipmentStatusDto {
    @ApiProperty({ enum: ShipmentStatus })
    @IsEnum(ShipmentStatus)
    status: ShipmentStatus;

    // ✅ Agregar campos opcionales para evitar errores de whitelist
    @IsOptional()
    shippedAt?: Date;

    @IsOptional()
    deliveredAt?: Date;

    @IsOptional()
    estimatedDelivery?: Date | string | null;
}