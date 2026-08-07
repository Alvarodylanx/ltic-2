import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({ imports: [MailModule, NotificationsModule], controllers: [OrdersController], providers: [OrdersService] })
export class OrdersModule {}
