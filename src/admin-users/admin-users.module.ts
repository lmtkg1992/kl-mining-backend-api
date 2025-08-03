import {
  // do not remove this comment
  Module,
  forwardRef,
} from "@nestjs/common";
import { AdminUsersService } from "./admin-users.service";
import { AdminUsersController } from "./admin-users.controller";
import { DocumentAdminUsersPersistenceModule } from "./infrastructure/persistence/document/document-persistence.module";
import { AuthModule } from "src/auth/auth.module";
import { SessionModule } from "src/session/session.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    // do not remove this comment
    DocumentAdminUsersPersistenceModule,
    SessionModule,
    JwtModule.register({}),
    forwardRef(() => AuthModule),
  ],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService, DocumentAdminUsersPersistenceModule],
})
export class AdminUsersModule {}
