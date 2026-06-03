// src/embroidery/entities/embroidery-request.entity.ts
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

// ✅ Importar Order solo si existe, si no, comentar la relación
// import { Order } from '../../orders/entities/order.entity';

export enum EmbroideryRequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

@Entity('embroidery_requests')
export class EmbroideryRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    productId: string;

    @Column({ type: 'varchar', length: 100 })
    productName: string;

    @Column({ type: 'varchar', length: 50 })
    productReference: string;

    @Column({ type: 'int', default: 15000 })
    maxStitches: number;

    @Column({ type: 'int', default: 6 })
    colors: number;

    @Column({ type: 'simple-array', nullable: true })
    positions: string[];

    @Column({ type: 'text', nullable: true })
    specialInstructions: string;

    @Column({ type: 'varchar', nullable: true })
    logoUrl: string;

    @Column({ type: 'varchar', nullable: true })
    logoPublicId: string;

    @Column({ type: 'varchar', nullable: true })
    originalFilename: string;

    @Column({ type: 'int', nullable: true })
    fileSize: number;

    @Column({ type: 'varchar', nullable: true })
    mimeType: string;

    @Column({ type: 'enum', enum: EmbroideryRequestStatus, default: EmbroideryRequestStatus.PENDING })
    status: EmbroideryRequestStatus;

    @Column({ type: 'text', nullable: true })
    adminNotes: string;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt: Date;

    // @ManyToOne(() => Order, { nullable: true })
    // @JoinColumn({ name: 'orderId' })
    // order: Order;

    @Column({ nullable: true })
    orderId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}