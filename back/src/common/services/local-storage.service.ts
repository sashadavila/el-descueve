// src/common/services/local-storage.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocalStorageService {
    private readonly logger = new Logger(LocalStorageService.name);
    private readonly uploadDir: string;

    constructor(private readonly configService: ConfigService) {
        this.uploadDir = path.join(process.cwd(), 'uploads', 'embroidery');
        this.ensureUploadDir();
    }

    private ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
            this.logger.log(`Directorio de uploads creado: ${this.uploadDir}`);
        }
    }

    async saveFile(file: Express.Multer.File): Promise<{ url: string; filename: string; publicId: string }> {
        const fileExt = path.extname(file.originalname);
        const filename = `${uuidv4()}${fileExt}`;
        const filePath = path.join(this.uploadDir, filename);

        // URL para acceder al archivo (servido estáticamente)
        const url = `/uploads/embroidery/${filename}`;

        await fs.promises.writeFile(filePath, file.buffer);

        this.logger.log(`Archivo guardado: ${filePath}`);

        return {
            url,
            filename,
            publicId: filename, // Usamos filename como identificador
        };
    }

    async deleteFile(publicId: string): Promise<void> {
        if (!publicId) return;
        const filePath = path.join(this.uploadDir, publicId);
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            this.logger.log(`Archivo eliminado: ${filePath}`);
        }
    }

    getFileUrl(filename: string): string {
        return `/uploads/embroidery/${filename}`;
    }
}