import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'usuario@empresa.cl',
        description: 'Email del usuario registrado',
    })
    @IsEmail()
    email!: string;
}