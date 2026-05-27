import { Controller, Get, Put, Param, ParseUUIDPipe, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Obtener todos los usuarios (solo admin)' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida correctamente.' })
    async findAll(): Promise<User[]> {
        console.log('📋 [UsersController] GET /users');
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Obtener un usuario por ID (solo admin)' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado correctamente.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User | null> {
        console.log(`📋 [UsersController] GET /users/${id}`);
        return this.usersService.findById(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar un usuario (solo admin)' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User | null> {
        console.log(`📋 [UsersController] PUT /users/${id}`);
        console.log('📦 Datos recibidos:', updateUserDto);

        // Validar que al menos un campo viene para actualizar
        if (Object.keys(updateUserDto).length === 0) {
            throw new BadRequestException('Debe proporcionar al menos un campo para actualizar');
        }

        return this.usersService.update(id, updateUserDto);
    }

    @Get('stats/summary')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Obtener estadísticas de usuarios (solo admin)' })
    @ApiResponse({ status: 200, description: 'Estadísticas obtenidas correctamente.' })
    async getStats(): Promise<any> {
        console.log('📊 [UsersController] GET /users/stats/summary');

        const users = await this.usersService.findAll();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const newUsersThisMonth = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
        });

        const stats = {
            totalUsers: users.length,
            adminUsers: users.filter(u => u.role === UserRole.ADMIN).length,
            clientUsers: users.filter(u => u.role === UserRole.CLIENT).length,
            activeUsers: users.filter(u => u.isActive).length,
            newUsersThisMonth: newUsersThisMonth.length,
        };

        console.log('📊 Estadísticas:', stats);

        return stats;
    }
}