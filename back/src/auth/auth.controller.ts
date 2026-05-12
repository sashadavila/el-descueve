// src/auth/auth.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'El email ya está registrado',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 201,
    description: 'Login exitoso',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}