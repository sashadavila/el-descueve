import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum NotificationType {
    NEW_USER = 'new_user',
    INACTIVE_USER = 'inactive_user',
    ADMIN_USER = 'admin_user',
    NEW_ORDER = 'new_order',
    SYSTEM_ALERT = 'system_alert',
}

export enum NotificationStatus {
    UNREAD = 'unread',
    READ = 'read',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    title!: string;

    @Column({ type: 'text' })
    message!: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.SYSTEM_ALERT,
    })
    type!: NotificationType;

    @Column({
        type: 'enum',
        enum: NotificationStatus,
        default: NotificationStatus.UNREAD,
    })
    status!: NotificationStatus;

    @Column({ type: 'jsonb', nullable: true })
    metadata!: {
        userId?: string;
        userName?: string;
        userEmail?: string;
        userCompany?: string;
        orderId?: string;
        [key: string]: any;
    };

    @Column({ type: 'varchar', length: 50, nullable: true })
    icon!: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    iconColor!: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    bgColor!: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}