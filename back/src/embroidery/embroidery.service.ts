// src/embroidery/embroidery.service.ts
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmbroideryRequest, EmbroideryRequestStatus } from './entities/embroidery-request.entity';
import { CreateEmbroideryRequestDto } from './dto/create-embroidery-request.dto';
import { UpdateEmbroideryRequestDto } from './dto/update-embroidery-request.dto';
import { LocalStorageService } from '../common/services/local-storage.service';

@Injectable()
export class EmbroideryService {
    private readonly logger = new Logger(EmbroideryService.name);

    constructor(
        @InjectRepository(EmbroideryRequest)
        private readonly embroideryRepository: Repository<EmbroideryRequest>,
        private readonly localStorageService: LocalStorageService,
    ) { }

    async create(
        userId: string,
        createDto: CreateEmbroideryRequestDto,
        file?: any,
    ): Promise<EmbroideryRequest> {
        console.log('🔧 [Service] ========== CREANDO SOLICITUD ==========');
        console.log('🔧 [Service] userId:', userId);
        console.log('🔧 [Service] orderId:', createDto.orderId);

        let logoUrl: string | undefined;
        let logoPublicId: string | undefined;

        if (!file) {
            throw new BadRequestException('Debes subir el archivo del logo');
        }

        try {
            const uploadResult = await this.localStorageService.saveFile(file);
            logoUrl = uploadResult.url;
            logoPublicId = uploadResult.publicId;
            console.log('🔧 [Service] Archivo guardado:', logoUrl);
        } catch (error) {
            this.logger.error(`Error saving file: ${error.message}`);
            throw new BadRequestException('Error al guardar el archivo del logo');
        }

        let positionsArray: string[] = [];
        if (typeof createDto.positions === 'string') {
            try {
                const parsed = JSON.parse(createDto.positions);
                positionsArray = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                positionsArray = [createDto.positions];
            }
        } else if (Array.isArray(createDto.positions)) {
            positionsArray = createDto.positions;
        }

        // ✅ Corregir: usar undefined en lugar de null para opcionales
        const requestData: Partial<EmbroideryRequest> = {
            userId: userId,
            productId: createDto.productId,
            productName: createDto.productName,
            productReference: createDto.productReference,
            maxStitches: createDto.maxStitches,
            colors: createDto.colors,
            positions: positionsArray,
            specialInstructions: createDto.specialInstructions || undefined,
            logoUrl: logoUrl,
            logoPublicId: logoPublicId,
            originalFilename: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            status: EmbroideryRequestStatus.PENDING,
            orderId: createDto.orderId || undefined,
        };

        const request = this.embroideryRepository.create(requestData);
        const saved = await this.embroideryRepository.save(request);

        console.log('✅ [Service] Solicitud guardada:', saved.id);

        return saved;
    }

    async findAll(userId?: string, status?: EmbroideryRequestStatus): Promise<EmbroideryRequest[]> {
        const query = this.embroideryRepository.createQueryBuilder('request')
            .orderBy('request.createdAt', 'DESC');

        if (userId) {
            query.andWhere('request.userId = :userId', { userId });
        }
        if (status) {
            query.andWhere('request.status = :status', { status });
        }

        return query.getMany();
    }

    async findOne(id: string, userId?: string): Promise<EmbroideryRequest> {
        const query = this.embroideryRepository.createQueryBuilder('request')
            .where('request.id = :id', { id });

        if (userId) {
            query.andWhere('request.userId = :userId', { userId });
        }

        const request = await query.getOne();

        if (!request) {
            throw new NotFoundException(`Solicitud de bordado con ID ${id} no encontrada`);
        }

        return request;
    }

    async updateStatus(
        id: string,
        updateDto: UpdateEmbroideryRequestDto,
        adminId?: string,
    ): Promise<EmbroideryRequest> {
        const request = await this.findOne(id);

        if (updateDto.status) {
            request.status = updateDto.status;
            if (updateDto.status === EmbroideryRequestStatus.APPROVED) {
                request.approvedAt = new Date();
            }
        }

        if (updateDto.adminNotes) {
            request.adminNotes = updateDto.adminNotes;
        }

        this.logger.log(`Solicitud ${id} actualizada a estado: ${request.status} por admin ${adminId}`);

        return this.embroideryRepository.save(request);
    }

    async getMyRequests(userId: string): Promise<EmbroideryRequest[]> {
        return this.findAll(userId);
    }

    async getRequestStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        inProgress: number;
        completed: number;
    }> {
        const total = await this.embroideryRepository.count();
        const pending = await this.embroideryRepository.count({ where: { status: EmbroideryRequestStatus.PENDING } });
        const approved = await this.embroideryRepository.count({ where: { status: EmbroideryRequestStatus.APPROVED } });
        const rejected = await this.embroideryRepository.count({ where: { status: EmbroideryRequestStatus.REJECTED } });
        const inProgress = await this.embroideryRepository.count({ where: { status: EmbroideryRequestStatus.IN_PROGRESS } });
        const completed = await this.embroideryRepository.count({ where: { status: EmbroideryRequestStatus.COMPLETED } });

        return { total, pending, approved, rejected, inProgress, completed };
    }
}