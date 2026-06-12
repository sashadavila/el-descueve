// src/orders/orders.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Shipment, ShipmentStatus, CarrierType } from '../shipments/entities/shipment.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,

  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    let total = 0;

    const order = this.ordersRepository.create({
      userId: createOrderDto.userId,
      status: 'PENDING',
      total: 0,
    });

    const savedOrder = await this.ordersRepository.save(order);
    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.productsRepository.findOne({
        where: {
          id: item.productId,
          isActive: true,
        },
      });

      if (!product) {
        throw new NotFoundException(
          `Producto con ID ${item.productId} no encontrado`,
        );
      }

      let quantity = item.quantity;
      if (!quantity || quantity < 1) {
        quantity = product.minOrder || 1;
      }

      if (product.stock < quantity) {
        throw new BadRequestException(
          `Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}, Solicitado: ${quantity}`,
        );
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * quantity;

      total += subtotal;

      product.stock -= quantity;
      await this.productsRepository.save(product);

      const orderItem = this.orderItemsRepository.create({
        orderId: savedOrder.id,
        productId: product.id,
        quantity: quantity,
        unitPrice,
        subtotal,
      });

      orderItems.push(await this.orderItemsRepository.save(orderItem));
    }

    savedOrder.total = total;
    savedOrder.items = orderItems;
    const finalOrder = await this.ordersRepository.save(savedOrder);

    // ✅ CREAR ENVÍO AUTOMÁTICAMENTE PARA LA ORDEN
    const trackingNumber = this.generateTrackingNumber(finalOrder.id);
    const shipment = this.shipmentRepository.create({
      orderId: finalOrder.id,
      userId: createOrderDto.userId,
      trackingNumber: trackingNumber,
      carrier: CarrierType.OWN,
      status: ShipmentStatus.RECEIVED,
      trackingHistory: [
        {
          status: ShipmentStatus.RECEIVED,
          location: 'Planta La Serena',
          timestamp: new Date(),
          description: 'Pedido recibido y en proceso de preparación'
        }
      ]
    });
    await this.shipmentRepository.save(shipment);

    return finalOrder;
  }

  private generateTrackingNumber(orderId: string): string {
    const shortId = orderId.slice(-8).toUpperCase();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ELD-${year}${month}${day}-${shortId}-${random}`;
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: {
        items: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    Object.assign(order, updateOrderDto);

    return this.ordersRepository.save(order);
  }

  async remove(id: string): Promise<{ message: string }> {
    const order = await this.findOne(id);

    await this.ordersRepository.remove(order);

    return {
      message: `Orden con ID ${id} eliminada correctamente`,
    };
  }

  async getStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    totalRevenue: number;
    averageOrderValue: number;
    pendingOrders: number;
    recentOrders: number;
  }> {
    const total = await this.ordersRepository.count();

    const byStatus = {
      PENDING: await this.ordersRepository.count({ where: { status: 'PENDING' } }),
      PAID: await this.ordersRepository.count({ where: { status: 'PAID' } }),
      CANCELLED: await this.ordersRepository.count({ where: { status: 'CANCELLED' } }),
      DELIVERED: await this.ordersRepository.count({ where: { status: 'DELIVERED' } }),
    };

    const allOrders = await this.ordersRepository.find();
    const totalRevenue = allOrders.reduce((sum, order) => sum + (parseFloat(order.total as any) || 0), 0);
    const averageOrderValue = total > 0 ? totalRevenue / total : 0;
    const pendingOrders = await this.ordersRepository.count({ where: { status: 'PENDING' } });

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const recentOrders = await this.ordersRepository.count({
      where: { createdAt: MoreThan(lastMonth) },
    });

    return {
      total,
      byStatus,
      totalRevenue,
      averageOrderValue,
      pendingOrders,
      recentOrders,
    };
  }
}