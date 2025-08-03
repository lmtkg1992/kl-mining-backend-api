import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';
import { DocumentAdminUsersPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    DocumentAdminUsersPersistenceModule,
  ],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService, DocumentAdminUsersPersistenceModule],
})
export class AdminUsersModule {}
