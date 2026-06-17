// src/shipments/dto/update-shipment.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { ShipmentStatus, CarrierType } from '../entities/shipment.entity';

export class UpdateShipmentDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    orderId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    userId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiPropertyOptional({ enum: CarrierType })
    @IsOptional()
    @IsEnum(CarrierType)
    carrier?: CarrierType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    carrierName?: string;

    @ApiPropertyOptional({ enum: ShipmentStatus })
    @IsOptional()
    @IsEnum(ShipmentStatus)
    status?: ShipmentStatus;

    // ✅ CORREGIDO: Permitir string vacío o null y transformar a null
    @ApiPropertyOptional({
        example: '2025-06-20',
        description: 'Fecha estimada de entrega (ISO 8601)',
        nullable: true,
    })
    @IsOptional()
    @Transform(({ value }) => {
        // Si es string vacío o null, retornar null
        if (value === '' || value === null || value === undefined) {
            return null;
        }
        // Intentar convertir a fecha
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return null;
            }
            return date.toISOString();
        } catch {
            return null;
        }
    })
    estimatedDelivery?: Date | string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional()
    @IsOptional()
    shippedAt?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    deliveredAt?: Date;
}