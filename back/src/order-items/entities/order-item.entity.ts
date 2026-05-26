import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.items, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column()
    orderId: string;

    @ManyToOne(() => Product, {
        eager: true,
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: string;

    @Column()
    quantity: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    unitPrice: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    subtotal: number;
}