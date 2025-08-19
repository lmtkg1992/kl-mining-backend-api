import {
  // do not remove this comment
  Module,
} from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { PermissionsController } from "./permissions.controller";
import { DocumentPermissionsPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentPermissionsPersistenceModule,
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService, DocumentPermissionsPersistenceModule],
})
export class PermissionsModule {}
