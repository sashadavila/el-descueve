import {
    Column,
    CreateDateColumn,
    UpdateDateColumn,
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

    // ✅ CAMPOS DE DIRECCIÓN - HACERLOS OPCIONALES (nullable: true)
    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    city: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    region: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    postalCode: string | null;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
        cascade: true,
    })
    items: OrderItem[];
}