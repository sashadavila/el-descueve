// src/embroidery/embroidery.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    ParseUUIDPipe,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Query,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { EmbroideryService } from './embroidery.service';
import { CreateEmbroideryRequestDto } from './dto/create-embroidery-request.dto';
import { UpdateEmbroideryRequestDto } from './dto/update-embroidery-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

// ✅ Importar el tipo correcto desde express
import { Request } from 'express';

@ApiTags('Embroidery')
@Controller('embroidery')
export class EmbroideryController {
    constructor(private readonly embroideryService: EmbroideryService) { }

    // src/embroidery/embroidery.controller.ts - Modificar el método createRequest

    @Post('requests')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear una solicitud de bordado con logo' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            console.log('🎯 [Interceptor] File recibido:', file?.originalname);
            const allowedMimes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf'];
            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Formato no permitido. Use JPG, PNG, SVG o PDF'), false);
            }
        },
    }))
    async createRequest(
        @Req() req: any,
        @Body() createDto: CreateEmbroideryRequestDto,
        @UploadedFile() file: any,
    ) {
        console.log('🚀 [Controller] ========== INICIANDO ==========');
        console.log('🚀 [Controller] Headers:', req.headers['content-type']);
        console.log('🚀 [Controller] Body (raw):', req.body);
        console.log('🚀 [Controller] File:', file);
        console.log('🚀 [Controller] createDto:', createDto);

        try {
            const result = await this.embroideryService.create(req.user.id, createDto, file);
            return result;
        } catch (error) {
            console.error('❌ [Controller] Error:', error);
            throw error;
        }
    }

    @Get('requests')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener mis solicitudes de bordado' })
    @ApiQuery({ name: 'status', required: false })
    async getMyRequests(@Req() req: any, @Query('status') status?: string) {
        return this.embroideryService.getMyRequests(req.user.id);
    }

    @Get('requests/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener una solicitud específica' })
    async getRequest(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
        return this.embroideryService.findOne(id, req.user.id);
    }

    @Get('admin/requests')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener todas las solicitudes (admin)' })
    @ApiQuery({ name: 'status', required: false })
    async getAllRequests(@Query('status') status?: string) {
        return this.embroideryService.findAll(undefined, status as any);
    }

    @Put('admin/requests/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar estado de solicitud (admin)' })
    async updateRequestStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateEmbroideryRequestDto,
        @Req() req: any,
    ) {
        return this.embroideryService.updateStatus(id, updateDto, req.user.id);
    }

    @Get('admin/stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Estadísticas de solicitudes (admin)' })
    async getStats() {
        return this.embroideryService.getRequestStats();
    }
}