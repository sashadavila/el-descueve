import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { EmailService } from '../common/services/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) { }

  async register(registerDto: RegisterDto) {
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

    return {
      message: 'Usuario registrado correctamente',
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'Login exitoso',
      access_token: accessToken,
      user: userWithoutPassword,
    };
  }

  // FORGOT PASSWORD - Solicitar recuperación
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return {
        message: 'Si el email está registrado, recibirás un enlace para recuperar tu contraseña',
      };
    }

    // Generar token único
    const resetToken = uuidv4();
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Token válido por 1 hora

    // Guardar token en el usuario
    await this.usersService.update(user.id, {
      resetToken,
      resetTokenExpires,
    });

    // Enviar email con el token
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      message: 'Si el email está registrado, recibirás un enlace para recuperar tu contraseña',
    };
  }

  // RESET PASSWORD - Restablecer contraseña
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    // Buscar usuario por token válido
    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    // Verificar si el token no ha expirado
    if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Token expirado. Solicita un nuevo enlace');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar token
    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    });

    return {
      message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión',
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
}