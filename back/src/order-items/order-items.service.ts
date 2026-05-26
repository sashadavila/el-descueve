import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
  ) {}

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemsRepository.find({
      relations: {
        order: true,
        product: true,
      },
    });
  }

  async findOne(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemsRepository.findOne({
      where: { id },
      relations: {
        order: true,
        product: true,
      },
    });

    if (!orderItem) {
      throw new NotFoundException(`Item de orden con ID ${id} no encontrado`);
    }

    return orderItem;
  }
}