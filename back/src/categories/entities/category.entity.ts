import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string;

    @Column({
        nullable: true,
    })
    imageUrl?: string;

    @Column({
        default: true,
    })
    isActive: boolean;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}