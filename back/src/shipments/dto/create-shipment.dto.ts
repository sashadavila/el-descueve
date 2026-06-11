// src/shipments/dto/create-shipment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { CarrierType, ShipmentStatus } from '../entities/shipment.entity';

export class CreateShipmentDto {
    @ApiProperty({ example: 'uuid-de-la-orden' })
    @IsUUID()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty({ example: 'uuid-del-usuario' })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: 'ELD-2025-00123' })
    @IsString()
    @IsNotEmpty()
    trackingNumber: string;

    @ApiProperty({ enum: CarrierType, example: CarrierType.EXTERNAL })
    @IsEnum(CarrierType)
    carrier: CarrierType;

    @ApiPropertyOptional({ example: 'Chilexpress' })
    @IsOptional()
    @IsString()
    carrierName?: string;

    @ApiPropertyOptional({ enum: ShipmentStatus, example: ShipmentStatus.RECEIVED })
    @IsOptional()
    @IsEnum(ShipmentStatus)
    status?: ShipmentStatus;

    @ApiPropertyOptional({ example: '2025-06-20' })
    @IsOptional()
    @IsDateString()
    estimatedDelivery?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}