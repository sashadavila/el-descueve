import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    IsArray,
    IsEnum,
    IsObject,
} from 'class-validator';
import { ProductType, ProductSize } from '../entities/product.entity';

export class EmbroideryDto {
    @ApiProperty({ example: true })
    included: boolean;

    @ApiProperty({ example: 15000 })
    maxStitches: number;

    @ApiProperty({ example: 6 })
    colors: number;

    @ApiProperty({ example: ['Pecho izquierdo', 'Manga'] })
    positions: string[];
}

export class CreateProductDto {
    @ApiProperty({ example: 'Polera Polo Piqué' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Polera polo en algodón piqué...' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'POL-001' })
    @IsString()
    @IsNotEmpty()
    reference: string;

    @ApiProperty({ example: 12900 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 15900 })
    @IsOptional()
    @IsNumber()
    comparePrice?: number;

    @ApiProperty({ enum: ProductType, example: ProductType.CORPORATIVO })
    @IsEnum(ProductType)
    productType: ProductType;

    @ApiProperty({ example: 'uuid-de-categoria' })
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @ApiPropertyOptional({ example: 'Poleras' })
    @IsOptional()
    @IsString()
    subcategory?: string;

    @ApiProperty({ enum: ProductSize, isArray: true, example: [ProductSize.S, ProductSize.M, ProductSize.L] })
    @IsArray()
    @IsEnum(ProductSize, { each: true })
    sizes: ProductSize[];

    @ApiProperty({ example: ['#163C7A', '#FFFFFF'] })
    @IsArray()
    @IsString({ each: true })
    colors: string[];

    @ApiPropertyOptional({ example: '100% Algodón Piqué' })
    @IsOptional()
    @IsString()
    material?: string;

    @ApiPropertyOptional({ example: '210 gr/m²' })
    @IsOptional()
    @IsString()
    weight?: string;

    @ApiProperty({ example: 250 })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @Min(1)
    minOrder: number;

    @ApiPropertyOptional({ example: 'https://...' })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({ isArray: true, example: ['https://...'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    isNew?: boolean;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    hasDiscount?: boolean;

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsNumber()
    discount?: number;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    reinforcement?: boolean;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    reflective?: boolean;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    thermal?: boolean;

    @ApiPropertyOptional({ type: EmbroideryDto })
    @IsOptional()
    @IsObject()
    embroidery?: EmbroideryDto;

    @ApiPropertyOptional({ example: ['Característica 1', 'Característica 2'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    features?: string[];
}