import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateMiningSitesDto } from "./dto/create-mining-sites.dto";
import { UpdateMiningSitesDto } from "./dto/update-mining-sites.dto";
import { MiningSitesRepository } from "./infrastructure/persistence/mining-sites.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { MiningSites } from "./domain/mining-sites";

@Injectable()
export class MiningSitesService {
  constructor(
    // Dependencies here
    private readonly miningSitesRepository: MiningSitesRepository,
  ) {}

  async create(createMiningSitesDto: CreateMiningSitesDto) {
    return this.miningSitesRepository.create({
      siteName: createMiningSitesDto.siteName,
      ownerUserId: createMiningSitesDto.ownerUserId,
      provinceId: createMiningSitesDto.provinceId,
      boundaryPolygon: createMiningSitesDto.boundaryPolygon,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.miningSitesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: MiningSites["id"]) {
    return this.miningSitesRepository.findById(id);
  }

  findByIds(ids: MiningSites["id"][]) {
    return this.miningSitesRepository.findByIds(ids);
  }

  async update(
    id: MiningSites["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateMiningSitesDto: UpdateMiningSitesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.miningSitesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: MiningSites["id"]) {
    return this.miningSitesRepository.remove(id);
  }
}
