// src/common/common.service.ts
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { EnumListItemDto } from "./dto/enum-list-response.dto";
import { AiCameraEnumDisplay } from "../ai-cameras/ai-cameras.enum";

@Injectable()
export class CommonService {
  listEnum(attributeCode: string): EnumListItemDto[] {
    const enumMap = AiCameraEnumDisplay[attributeCode];
    if (!enumMap) {
      throw new HttpException("Invalid attribute code", HttpStatus.BAD_REQUEST);
    }

    return Object.entries(enumMap).map(([key, name]) => ({
      key,
      name: String(name),
    }));
  }
}