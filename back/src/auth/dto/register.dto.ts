import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
    Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
    @ApiProperty({
        example: 'Juan Pérez',
        description: 'Nombre completo del usuario',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example: 'juan@empresa.cl',
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

    // NUEVOS CAMPOS
    @ApiPropertyOptional({
        example: '+56 9 1234 5678',
        description: 'Teléfono de contacto',
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({
        example: 'Mi Empresa S.A.',
        description: 'Nombre de la empresa',
    })
    @IsOptional()
    @IsString()
    company?: string;

    @ApiPropertyOptional({
        example: '76.123.456-7',
        description: 'RUT de la empresa',
    })
    @IsOptional()
    @IsString()
    @Matches(/^([0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK])$/, {
        message: 'Formato de RUT inválido. Ejemplo: 76.123.456-7',
    })
    rut?: string;

    @ApiPropertyOptional({
        example: UserRole.CLIENT,
        enum: UserRole,
        description: 'Rol del usuario',
    })
    @IsOptional()
    role?: UserRole;
}