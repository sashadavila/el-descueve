// src/embroidery/dto/update-embroidery-request.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EmbroideryRequestStatus } from '../entities/embroidery-request.entity';

export class UpdateEmbroideryRequestDto {
    @ApiPropertyOptional({ enum: EmbroideryRequestStatus })
    @IsOptional()
    @IsEnum(EmbroideryRequestStatus)
    status?: EmbroideryRequestStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    adminNotes?: string;
}