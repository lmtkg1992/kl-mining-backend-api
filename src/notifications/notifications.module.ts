import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notifications.controller";
import { DocumentNotificationsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentNotificationsPersistenceModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService, DocumentNotificationsPersistenceModule],
})
export class NotificationsModule {}
