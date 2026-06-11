// src/shipments/dto/update-shipment.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateShipmentDto } from './create-shipment.dto';
import { IsEnum, IsOptional, IsDate } from 'class-validator';
import { ShipmentStatus } from '../entities/shipment.entity';

export class UpdateShipmentDto extends PartialType(CreateShipmentDto) {
    @IsOptional()
    @IsEnum(ShipmentStatus)
    status?: ShipmentStatus;

    shippedAt?: Date;
    deliveredAt?: Date;
}