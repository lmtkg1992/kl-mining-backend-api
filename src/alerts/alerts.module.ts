import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { AlertsService } from "./alerts.service";
import { AlertsController } from "./alerts.controller";
import { DocumentAlertsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentAlertsPersistenceModule,
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService, DocumentAlertsPersistenceModule],
})
export class AlertsModule {}
