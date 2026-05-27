import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'superSecretKey',
        });
        console.log('🔧 [JwtStrategy] Inicializado con secret:', process.env.JWT_SECRET || 'superSecretKey');
    }

    async validate(payload: { sub: string; email: string; role: string }) {
        console.log('🔍 [JwtStrategy] Payload recibido:', payload);
        console.log('🔍 [JwtStrategy] User ID:', payload.sub);

        const user = await this.usersService.findById(payload.sub);

        if (!user) {
            console.log('❌ [JwtStrategy] Usuario no encontrado');
            throw new UnauthorizedException('Usuario no encontrado');
        }

        if (!user.isActive) {
            console.log('❌ [JwtStrategy] Usuario inactivo');
            throw new UnauthorizedException('Usuario inactivo');
        }

        const result = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            phone: user.phone,
            company: user.company,
            rut: user.rut,
        };

        console.log('✅ [JwtStrategy] Usuario validado:', result);

        return result;
    }
}