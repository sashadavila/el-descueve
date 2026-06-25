// src/contact-messages/contact-messages.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseUUIDPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ContactMessagesService } from './contact-messages.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { RespondMessageDto } from './dto/respond-message.dto';
import { ContactMessage, ContactMessageStatus } from './entities/contact-message.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Contact')
@Controller('contact')
export class ContactMessagesController {
    constructor(private readonly contactService: ContactMessagesService) { }

    // ============ ENDPOINTS PÚBLICOS ============

    @Post()
    @Public()
    @ApiOperation({ summary: 'Enviar un mensaje de contacto' })
    @ApiResponse({ status: 201, description: 'Mensaje enviado correctamente', type: ContactMessage })
    async create(@Body() createDto: CreateContactMessageDto): Promise<ContactMessage> {
        return this.contactService.create(createDto);
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Obtener un mensaje por ID (público con ID)' })
    @ApiResponse({ status: 200, description: 'Mensaje encontrado', type: ContactMessage })
    @ApiResponse({ status: 404, description: 'Mensaje no encontrado' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ContactMessage> {
        return this.contactService.findOne(id);
    }

    // ============ ENDPOINTS DE ADMIN (PROTEGIDOS) ============

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener todos los mensajes (solo admin)' })
    @ApiQuery({ name: 'status', required: false, enum: ContactMessageStatus })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    async findAll(
        @Query('status') status?: ContactMessageStatus,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
    ) {
        return this.contactService.findAll(
            status,
            parseInt(page),
            parseInt(limit),
        );
    }

    @Get('stats/summary')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener estadísticas de mensajes (admin)' })
    @ApiResponse({ status: 200, description: 'Estadísticas obtenidas correctamente' })
    async getStats() {
        return this.contactService.getStats();
    }

    @Post(':id/respond')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Responder a un mensaje de contacto (admin)' })
    @ApiResponse({ status: 200, description: 'Mensaje respondido correctamente', type: ContactMessage })
    async respond(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() respondDto: RespondMessageDto,
    ): Promise<ContactMessage> {
        return this.contactService.respond(id, respondDto);
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar estado de un mensaje (admin)' })
    @ApiResponse({ status: 200, description: 'Estado actualizado', type: ContactMessage })
    async updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateContactMessageDto,
    ): Promise<ContactMessage> {
        return this.contactService.updateStatus(id, updateDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar un mensaje (admin)' })
    @ApiResponse({ status: 200, description: 'Mensaje eliminado correctamente' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        return this.contactService.remove(id);
    }
}