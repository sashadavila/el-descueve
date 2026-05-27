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

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email!: string;

    @Column({ type: 'varchar', nullable: true })
    password!: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    company!: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    rut!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CLIENT,
    })
    role!: UserRole;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @Column({ type: 'varchar', nullable: true, unique: true })
    googleId!: string | null;

    @Column({ type: 'varchar', nullable: true })
    photoUrl!: string | null;

    @Column({ type: 'varchar', nullable: true })
    resetToken!: string | null;

    @Column({ type: 'timestamp', nullable: true })
    resetTokenExpires!: Date | null;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}