import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "../../config/config.type";
import { Request } from "express";

@Injectable()
export class FixedTokenGuard implements CanActivate {
  constructor(private configService: ConfigService<AllConfigType>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Token not provided");
    }

    const validToken = this.configService.get<string | undefined>(
      "aiSnapshots.apiToken",
      { infer: true },
    );

    if (!validToken || token !== validToken) {
      throw new UnauthorizedException("Invalid or missing token");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}

