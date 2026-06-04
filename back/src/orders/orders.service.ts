// src/orders/orders.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
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

      // ✅ CORREGIDO: Si no viene quantity, usar minOrder del producto o 1 por defecto
      let quantity = item.quantity;
      if (!quantity || quantity < 1) {
        quantity = product.minOrder || 1;
        console.log(`📦 [OrdersService] quantity no enviado para producto ${product.name}, usando minOrder: ${quantity}`);
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

    return this.ordersRepository.save(savedOrder);
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
}