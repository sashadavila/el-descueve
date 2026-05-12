import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
    @ApiProperty({
        example: 'Sasha',
        description: 'Nombre del usuario',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example: 'sasha@gmail.com',
        description: 'Email del usuario',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: '123456',
        description: 'Contraseña del usuario',
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiPropertyOptional({
        example: UserRole.CLIENT,
        enum: UserRole,
        description: 'Rol del usuario',
    })
    @IsOptional()
    role?: UserRole;
}