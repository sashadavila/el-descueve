// src/shipments/shipments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';
import { Shipment } from './entities/shipment.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Shipment]),
        OrdersModule,
    ],
    controllers: [ShipmentsController],
    providers: [ShipmentsService],
    exports: [ShipmentsService],
})
export class ShipmentsModule { }