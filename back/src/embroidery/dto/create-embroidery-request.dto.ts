// src/embroidery/dto/create-embroidery-request.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateEmbroideryRequestDto {
    @ApiProperty()
    @IsUUID()
    productId: string;

    @ApiProperty()
    @IsString()
    productName: string;

    @ApiProperty()
    @IsString()
    productReference: string;

    @ApiProperty()
    @IsInt()
    @Min(5000)
    @Max(50000)
    @Type(() => Number)
    maxStitches: number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @Max(12)
    @Type(() => Number)
    colors: number;

    @ApiProperty()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                return [value];
            }
        }
        if (Array.isArray(value)) return value;
        return [];
    })
    @IsArray()
    @IsString({ each: true })
    positions: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    specialInstructions?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    orderId?: string;
}