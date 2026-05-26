import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { EmailService } from '../common/services/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) { }

  async register(registerDto: RegisterDto, req?: Request) {
    const { name, email, password, phone, company, rut, role } = registerDto;

    const userExists = await this.usersService.findByEmail(email);

    if (userExists) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || undefined,
      company: company || undefined,
      rut: rut || undefined,
      role: role || UserRole.CLIENT,
    });

    const { password: _, ...userWithoutPassword } = user;

    // 📧 ENVIAR EMAIL DE BIENVENIDA
    await this.emailService.sendWelcomeEmail({
      name: user.name,
      email: user.email,
      company: user.company || undefined,
    });

    this.logger.log(`✅ Nuevo usuario registrado: ${user.email} - ${user.company || 'Sin empresa'}`);

    return {
      message: 'Usuario registrado correctamente. Te hemos enviado un email de bienvenida.',
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto, req?: Request) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.password) {
      throw new UnauthorizedException('Esta cuenta fue creada con Google. Inicia sesión con Google');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    const { password: _, ...userWithoutPassword } = user;

    // 📧 ENVIAR ALERTA DE INICIO DE SESIÓN
    const ip = req?.ip || req?.socket?.remoteAddress || 'IP no disponible';
    const userAgent = req?.headers['user-agent'] || 'Desconocido';

    await this.emailService.sendLoginAlert({
      name: user.name,
      email: user.email,
      ip: ip,
      userAgent: userAgent,
      timestamp: new Date(),
    });

    this.logger.log(`🔐 Usuario autenticado: ${user.email} - IP: ${ip}`);

    return {
      message: 'Login exitoso. Te hemos enviado un email de confirmación.',
      access_token: accessToken,
      user: userWithoutPassword,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return {
        message: 'Si el email está registrado, recibirás un enlace para recuperar tu contraseña',
      };
    }

    if (!user.password) {
      return {
        message: 'Esta cuenta fue creada con Google. Inicia sesión con Google',
      };
    }

    const resetToken = uuidv4();
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);

    await this.usersService.update(user.id, {
      resetToken,
      resetTokenExpires,
    });

    // 📧 ENVIAR EMAIL DE RECUPERACIÓN (mejorado con nombre)
    await this.emailService.sendPasswordResetEmailWithName(email, user.name, resetToken);

    this.logger.log(`📧 Email de recuperación enviado a: ${email}`);

    return {
      message: 'Si el email está registrado, recibirás un enlace para recuperar tu contraseña',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, req?: Request) {
    const { token, newPassword } = resetPasswordDto;
    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Token expirado. Solicita un nuevo enlace');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    });

    // 📧 ENVIAR ALERTA DE CAMBIO DE CONTRASEÑA
    const ip = req?.ip || req?.socket?.remoteAddress || 'IP no disponible';
    const userAgent = req?.headers['user-agent'] || 'Desconocido';

    await this.emailService.sendPasswordChangeAlert({
      name: user.name,
      email: user.email,
      ip: ip,
      userAgent: userAgent,
      timestamp: new Date(),
    });

    this.logger.log(`🔐 Contraseña actualizada para: ${user.email} - IP: ${ip}`);

    return {
      message: 'Contraseña actualizada correctamente. Te hemos enviado un email de confirmación.',
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async googleLogin(user: any, req?: Request) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const { password, ...userWithoutPassword } = user;

    // 📧 ENVIAR ALERTA DE INICIO DE SESIÓN (para Google)
    const ip = req?.ip || req?.socket?.remoteAddress || 'IP no disponible';
    const userAgent = req?.headers['user-agent'] || 'Desconocido';

    await this.emailService.sendLoginAlert({
      name: user.name,
      email: user.email,
      ip: ip,
      userAgent: userAgent,
      timestamp: new Date(),
    });

    this.logger.log(`🔐 Usuario autenticado con Google: ${user.email} - IP: ${ip}`);

    return {
      message: 'Login con Google exitoso. Te hemos enviado un email de confirmación.',
      access_token: accessToken,
      user: userWithoutPassword,
    };
  }
}