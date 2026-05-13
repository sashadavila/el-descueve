import { IsEmail, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'sasha@gmail.com',
        description: 'Email del usuario',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: '123456',
        description: 'Contraseña del usuario',
    })
    @IsString()
    @MinLength(6)
    password!: string;
}