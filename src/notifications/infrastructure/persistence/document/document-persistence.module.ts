import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  NotificationsSchema,
  NotificationsSchemaClass,
} from "./entities/notifications.schema";
import { NotificationsRepository } from "../notifications.repository";
import { NotificationsDocumentRepository } from "./repositories/notifications.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationsSchemaClass.name, schema: NotificationsSchema },
    ]),
  ],
  providers: [
    {
      provide: NotificationsRepository,
      useClass: NotificationsDocumentRepository,
    },
  ],
  exports: [NotificationsRepository],
})
export class DocumentNotificationsPersistenceModule {}
