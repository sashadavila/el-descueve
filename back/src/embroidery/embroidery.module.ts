// src/embroidery/embroidery.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbroideryController } from './embroidery.controller';
import { EmbroideryService } from './embroidery.service';
import { EmbroideryRequest } from './entities/embroidery-request.entity';
import { LocalStorageService } from '../common/services/local-storage.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([EmbroideryRequest]),
    ],
    controllers: [EmbroideryController],
    providers: [EmbroideryService, LocalStorageService],
    exports: [EmbroideryService],
})
export class EmbroideryModule { }