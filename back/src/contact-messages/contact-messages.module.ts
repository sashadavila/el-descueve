// src/contact-messages/contact-messages.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessagesController } from './contact-messages.controller';
import { ContactMessagesService } from './contact-messages.service';
import { ContactMessage } from './entities/contact-message.entity';
import { EmailService } from '../common/services/email.service';
import { EmailTemplatesService } from '../common/services/email-templates.service';

@Module({
    imports: [TypeOrmModule.forFeature([ContactMessage])],
    controllers: [ContactMessagesController],
    providers: [ContactMessagesService, EmailService, EmailTemplatesService],
    exports: [ContactMessagesService],
})
export class ContactMessagesModule { }