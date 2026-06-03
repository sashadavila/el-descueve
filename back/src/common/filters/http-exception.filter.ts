// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const errorResponse = exception.getResponse();

        this.logger.error(`❌ HTTP Exception: ${request.method} ${request.url}`);
        this.logger.error(`Status: ${status}`);
        this.logger.error(`Response: ${JSON.stringify(errorResponse, null, 2)}`);

        // Si es error de validación, mostrar detalles
        if (status === 400 && typeof errorResponse === 'object') {
            this.logger.error(`Validation errors: ${JSON.stringify((errorResponse as any).message, null, 2)}`);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof errorResponse === 'string' ? errorResponse : (errorResponse as any).message,
        });
    }
}