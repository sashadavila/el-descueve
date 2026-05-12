// src/users/entities/user.entity.ts

import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    CLIENT = 'client',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 100 })
    name!: string;

    @Column({ unique: true, length: 150 })
    email!: string;

    @Column()
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CLIENT,
    })
    role!: UserRole;

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}