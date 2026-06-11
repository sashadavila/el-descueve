// src/shipments/dto/update-shipment-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ShipmentStatus } from '../entities/shipment.entity';

export class UpdateShipmentStatusDto {
    @ApiProperty({ enum: ShipmentStatus })
    @IsEnum(ShipmentStatus)
    status: ShipmentStatus;
}