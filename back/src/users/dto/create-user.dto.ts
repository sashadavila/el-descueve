import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @ApiProperty({ example: 'Juan Pérez' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'juan@empresa.cl' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ example: '+56 9 1234 5678' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: 'Mi Empresa S.A.' })
    @IsOptional()
    @IsString()
    company?: string;

    @ApiPropertyOptional({ example: '76.123.456-7' })
    @IsOptional()
    @IsString()
    @Matches(/^([0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK])$/, {
        message: 'Formato de RUT inválido. Ejemplo: 76.123.456-7',
    })
    rut?: string;

    @ApiPropertyOptional({ example: UserRole.CLIENT, enum: UserRole })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}