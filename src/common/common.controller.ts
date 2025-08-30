// src/common/common.controller.ts
import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { CommonService } from "./common.service";
import { EnumListItemDto } from "./dto/enum-list-response.dto";

@ApiTags("Common")
@Controller({
  path: "common",
  version: "1",
})
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get("enums/:attribute_code")
  @ApiParam({ name: "attribute_code", type: String })
  @ApiOkResponse({ type: [EnumListItemDto] })
  listEnums(@Param("attribute_code") attributeCode: string): EnumListItemDto[] {
    return this.commonService.listEnum(attributeCode);
  }
}
