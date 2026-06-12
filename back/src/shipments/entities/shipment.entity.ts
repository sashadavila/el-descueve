// src/shipments/entities/shipment.entity.ts
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

export enum ShipmentStatus {
    RECEIVED = 'Pedido Recibido',      // Pedido recibido
    PREPARING = 'En Preparación',       // En preparación
    TRANSIT = 'En Tránsito',           // En tránsito
    DELIVERED = 'Entregado',           // Entregado
}

export enum CarrierType {
    OWN = 'propio',      // Envío propio de la empresa
    EXTERNAL = 'externo', // Empresa externa (Chilexpress, Starken, etc.)
}

@Entity('shipments')
export class Shipment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    orderId: string;

    @ManyToOne(() => Order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'varchar', length: 50, unique: true })
    trackingNumber: string;

    @Column({ type: 'enum', enum: CarrierType, default: CarrierType.OWN })
    carrier: CarrierType;

    @Column({ type: 'varchar', length: 100, nullable: true })
    carrierName: string;

    @Column({ type: 'enum', enum: ShipmentStatus, default: ShipmentStatus.RECEIVED })
    status: ShipmentStatus;

    @Column({ type: 'date', nullable: true })
    estimatedDelivery: Date;

    @Column({ type: 'timestamp', nullable: true })
    shippedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deliveredAt: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'jsonb', nullable: true })
    trackingHistory: {
        status: ShipmentStatus;
        location: string;
        timestamp: Date;
        description: string;
    }[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}