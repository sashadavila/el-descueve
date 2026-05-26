import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderItem } from '../../order-items/entities/order-item.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    })
    total: number;

    @Column({
        default: 'PENDING',
    })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
        cascade: true,
    })
    items: OrderItem[];
}