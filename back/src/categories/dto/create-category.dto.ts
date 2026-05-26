import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Ropa de trabajo',
        description: 'Nombre de la categoría',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        example: 'Indumentaria laboral para trabajo industrial y oficina.',
        description: 'Descripción de la categoría',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        example: 'https://res.cloudinary.com/demo/category-image.jpg',
        description: 'Imagen representativa de la categoría',
    })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Indica si la categoría está activa',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}