// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Shipment } from '../shipments/entities/shipment.entity'; // ← Agregar importación

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, Shipment]) // ← Agregar Shipment aquí
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule { }