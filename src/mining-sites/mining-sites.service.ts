import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateMiningSitesDto } from "./dto/create-mining-sites.dto";
import { UpdateMiningSitesDto } from "./dto/update-mining-sites.dto";
import { MiningSitesRepository } from "./infrastructure/persistence/mining-sites.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { MiningSites } from "./domain/mining-sites";
import { FindAllMiningSitesDto } from "./dto/find-all-mining-sites.dto";
import { Provinces } from "../provinces/domain/provinces";
import { MiningSitesStatisticsResponseDto } from "./dto/mining-sites-statistics-response.dto";

@Injectable()
export class MiningSitesService {
  constructor(
    // Dependencies here
    private readonly miningSitesRepository: MiningSitesRepository,
  ) {}

  async create(createMiningSitesDto: CreateMiningSitesDto) {
    return this.miningSitesRepository.create({
      siteName: createMiningSitesDto.siteName,
      status: createMiningSitesDto.status,
      ownerUserId: createMiningSitesDto.ownerUserId,
      province: {
        id: createMiningSitesDto.province,
      } as Provinces,
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

  async findAllWithFilterAndPagination(
    query: FindAllMiningSitesDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    if (query.province_id) {
      filter["province"] = query.province_id;
    }

    const [entites, total] = await Promise.all([
      this.miningSitesRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.miningSitesRepository.countWithFilter(filter),
    ]);

    return { entites, total };
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

  async getStatistics(siteId: string): Promise<MiningSitesStatisticsResponseDto> {
    return {
      siteId,
      lastUpdated: new Date().toISOString(),
      siteStatus: {
        totalSites: 1,
        operationalSites: 1,
        statusText: "All system operational",
      },
      breachAlerts: {
        count: 7,
        change: -5.1,
      },
      truckActivities: {
        count: 89,
        change: 12.4,
      },
      totalVolume: {
        value: 2150,
        unit: "m3",
        percentageQuota: 92,
      },
    };
  }
}
