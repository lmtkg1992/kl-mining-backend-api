import {
  // common
  Injectable,
  UnprocessableEntityException,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ms from "ms";

import { JwtPayloadType } from "src/auth/strategies/types/jwt-payload.type";
import { AllConfigType } from "src/config/config.type";
import { Session } from "src/session/domain/session";
import { SessionService } from "src/session/session.service";
import { RoleEnum } from "src/roles/roles.enum";
import { User } from "src/users/domain/user";
import { IPaginationOptions } from "../utils/types/pagination-options";

import { CreateAdminUsersDto } from "./dto/create-admin-users.dto";
import { UpdateAdminUsersDto } from "./dto/update-admin-users.dto";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AdminLoginResponseDto } from "./dto/admin-login-response.dto";
import { AdminUsersRepository } from "./infrastructure/persistence/admin-users.repository";
import { AdminUsers } from "./domain/admin-users";
import { UserStatusEnum } from "./admin-users.enum";
import { JwtRefreshPayloadType } from "src/auth/strategies/types/jwt-refresh-payload.type";
import { AdminUserGroups } from "src/admin-user-groups/domain/admin-user-groups";
import { FindAllAdminUsersDto } from "./dto/find-all-admin-users.dto";

@Injectable()
export class AdminUsersService {
  constructor(
    // Dependencies here
    private readonly adminUsersRepository: AdminUsersRepository,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAdminUsersDto: CreateAdminUsersDto) {
    // Do not remove comment below.
    // <creating-property />

    const existing = await this.adminUsersRepository.findByEmail(
      createAdminUsersDto.email,
    );
    if (existing) {
      throw new UnprocessableEntityException({
        statusCode: 400,
        message: "Username already exists",
        error: "usernameAlreadyExists",
      });
    }

    let password: string | undefined = undefined;

    if (createAdminUsersDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createAdminUsersDto.password, salt);
    }

    return this.adminUsersRepository.create({
      email: createAdminUsersDto.email,
      name: createAdminUsersDto.name,
      status: createAdminUsersDto.status || UserStatusEnum.ACTIVE,
      password,
      admin_user_group: {
        id: createAdminUsersDto.admin_user_group,
      } as AdminUserGroups,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.adminUsersRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllAdminUsersDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entites, total] = await Promise.all([
      this.adminUsersRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.adminUsersRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: AdminUsers["id"]) {
    return this.adminUsersRepository.findById(id);
  }

  findByIds(ids: AdminUsers["id"][]) {
    return this.adminUsersRepository.findByIds(ids);
  }

  findByEmail(email: string) {
    return this.adminUsersRepository.findByEmail(email);
  }

  async update(
    id: AdminUsers["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAdminUsersDto: UpdateAdminUsersDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.adminUsersRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: AdminUsers["id"]) {
    return this.adminUsersRepository.remove(id);
  }

  // Admin Users Auth
  me(user: JwtPayloadType) {
    return this.adminUsersRepository.findById(user.id.toString());
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, "sessionId" | "hash">,
  ): Promise<Omit<AdminLoginResponseDto, "user">> {
    const session = await this.sessionService.findById(data.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash("sha256")
      .update(randomStringGenerator())
      .digest("hex");

    // const user = await this.findById(session.user.id.toString());

    // if (!user?.role) {
    //   throw new UnauthorizedException();
    // }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      role: {
        id: RoleEnum.admin,
      },
      sessionId: session.id,
      hash,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async validateLogin(loginDto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    const user = await this.findByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: "notFound",
        },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: "incorrectPassword",
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: "incorrectPassword",
        },
      });
    }

    const hash = crypto
      .createHash("sha256")
      .update(randomStringGenerator())
      .digest("hex");

    const session = await this.sessionService.create({
      user: user as unknown as User,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: { id: RoleEnum.admin },
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user: user as AdminUsers,
    };
  }

  private async getTokensData(data: {
    id: User["id"];
    role: User["role"];
    sessionId: Session["id"];
    hash: Session["hash"];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow("auth.expires", {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow("auth.secret", { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow("auth.refreshSecret", {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow("auth.refreshExpires", {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
