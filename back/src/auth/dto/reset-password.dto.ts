import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({
        example: 'reset-token-123456',
        description: 'Token de recuperación enviado al email',
    })
    @IsString()
    @IsNotEmpty()
    token!: string;

    @ApiProperty({
        example: 'nuevaContraseña123',
        description: 'Nueva contraseña',
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    newPassword!: string;
}