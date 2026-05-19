import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { name, email, password, phone, company, rut, role } = registerDto;

    const userExists = await this.usersService.findByEmail(email);

    if (userExists) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //  Guardar todos los campos
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      company: company || null,
      rut: rut || null,
      role: role || 'client',
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
}