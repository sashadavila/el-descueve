import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        example: 'Camisa de trabajo azul',
        description: 'Nombre del producto',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'Camisa resistente para uso laboral diario.',
        description: 'Descripción del producto',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: 12500,
        description: 'Precio del producto',
        minimum: 0,
    })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({
        example: '9f4b67f5-4b72-4f53-bcc2-5d5d7d63a321',
        description: 'ID de la categoría del producto',
    })
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({
        example: 'M',
        description: 'Talle del producto',
    })
    @IsString()
    @IsNotEmpty()
    size: string;

    @ApiProperty({
        example: 'Azul',
        description: 'Color del producto',
    })
    @IsString()
    @IsNotEmpty()
    color: string;

    @ApiProperty({
        example: 20,
        description: 'Cantidad disponible en stock',
        minimum: 0,
    })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiPropertyOptional({
        example: 'https://res.cloudinary.com/demo/product-image.jpg',
        description: 'URL de la imagen del producto',
    })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Indica si el producto está activo',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}