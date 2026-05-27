import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        console.log('🔒 [JwtAuthGuard] Verificando token...');
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        console.log('🔒 [JwtAuthGuard] Error:', err);
        console.log('🔒 [JwtAuthGuard] User:', user);
        console.log('🔒 [JwtAuthGuard] Info:', info);

        if (err || !user) {
            console.log('🔒 [JwtAuthGuard] Error de autenticación:', info?.message || err?.message);
            throw new UnauthorizedException('Token inválido o no proporcionado');
        }
        return user;
    }
}