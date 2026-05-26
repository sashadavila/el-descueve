import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => Category, (category) => category.products, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: string;

    @Column()
    size: string;

    @Column()
    color: string;

    @Column({ default: 0 })
    stock: number;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ default: true })
    isActive: boolean;
}