// src/contact-messages/entities/contact-message.entity.ts
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum ContactMessageStatus {
    PENDING = 'pending',
    READ = 'read',
    RESPONDED = 'responded',
    ARCHIVED = 'archived',
}

@Entity('contact_messages')
export class ContactMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 150 })
    email: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    company: string;

    @Column({ type: 'varchar', length: 255 })
    subject: string;

    @Column({ type: 'text' })
    message: string;

    @Column({
        type: 'enum',
        enum: ContactMessageStatus,
        default: ContactMessageStatus.PENDING,
    })
    status: ContactMessageStatus;

    @Column({ type: 'text', nullable: true })
    adminNotes: string;

    @Column({ type: 'timestamp', nullable: true })
    respondedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}