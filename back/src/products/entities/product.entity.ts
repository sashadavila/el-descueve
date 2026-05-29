import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

export enum ProductType {
    CORPORATIVO = 'corporativo',
    INDUSTRIAL = 'industrial',
    BORDADOS = 'bordados',
    EQUIPOS = 'equipos',
}

export enum ProductSize {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = '2XL',
    XXXL = '3XL',
}

export interface EmbroideryData {
    included: boolean;
    maxStitches: number;
    colors: number;
    positions: string[];
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    reference: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    comparePrice: number;

    @Column({ type: 'enum', enum: ProductType, default: ProductType.CORPORATIVO })
    productType: ProductType;

    @ManyToOne(() => Category, (category) => category.products, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    subcategory: string;

    @Column({ type: 'enum', enum: ProductSize, array: true, default: [ProductSize.S, ProductSize.M, ProductSize.L] })
    sizes: ProductSize[];

    @Column({ type: 'varchar', array: true, default: [] })
    colors: string[];

    @Column({ type: 'varchar', length: 100, nullable: true })
    material: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    weight: string;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ type: 'int', default: 10 })
    minOrder: number;

    @Column({ type: 'varchar', nullable: true })
    imageUrl: string;

    @Column({ type: 'varchar', array: true, default: [] })
    images: string[];

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isNew: boolean;

    @Column({ type: 'boolean', default: false })
    isFeatured: boolean;

    @Column({ type: 'boolean', default: false })
    hasDiscount: boolean;

    @Column({ type: 'int', default: 0 })
    discount: number;

    @Column({ type: 'boolean', default: false })
    reinforcement: boolean;

    @Column({ type: 'boolean', default: false })
    reflective: boolean;

    @Column({ type: 'boolean', default: false })
    thermal: boolean;

    @Column({ type: 'jsonb', nullable: true })
    embroidery: EmbroideryData | null;

    @Column({ type: 'jsonb', nullable: true })
    features: string[] | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}