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
import { PermissionsModule } from "src/permissions/permissions.module";
import { ProvincesModule } from "src/provinces/provinces.module";
import { MiningSitesModule } from "src/mining-sites/mining-sites.module";

@Module({
  imports: [
    // do not remove this comment
    DocumentAdminUsersPersistenceModule,
    SessionModule,
    PermissionsModule,
    JwtModule.register({}),
    forwardRef(() => AuthModule),
    forwardRef(() => ProvincesModule),
    forwardRef(() => MiningSitesModule),
  ],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService, DocumentAdminUsersPersistenceModule],
})
export class AdminUsersModule {}
