// src/shipments/dto/update-shipment.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateShipmentDto } from './create-shipment.dto';
import { IsEnum, IsOptional, IsDateString, IsString, IsUUID } from 'class-validator';
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

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    estimatedDelivery?: Date | string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;

    // ✅ Estos campos son gestionados internamente por el servicio
    // No se deben enviar desde el frontend, pero los aceptamos como opcionales
    @ApiPropertyOptional()
    @IsOptional()
    shippedAt?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    deliveredAt?: Date;
}