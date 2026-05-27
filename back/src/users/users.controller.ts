import { Controller, Get, Put, Param, ParseUUIDPipe, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener todos los usuarios (solo admin)' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida correctamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado. Se requiere rol admin.' })
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener un usuario por ID (solo admin)' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado correctamente.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User | null> {
        return this.usersService.findById(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar un usuario (solo admin)' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User | null> {
        return this.usersService.update(id, updateUserDto);
    }

    @Get('stats/summary')
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener estadísticas de usuarios (solo admin)' })
    @ApiResponse({ status: 200, description: 'Estadísticas obtenidas correctamente.' })
    async getStats(): Promise<any> {
        const users = await this.usersService.findAll();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const newUsersThisMonth = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
        });

        return {
            totalUsers: users.length,
            adminUsers: users.filter(u => u.role === UserRole.ADMIN).length,
            clientUsers: users.filter(u => u.role === UserRole.CLIENT).length,
            activeUsers: users.filter(u => u.isActive).length,
            newUsersThisMonth: newUsersThisMonth.length,
        };
    }
}