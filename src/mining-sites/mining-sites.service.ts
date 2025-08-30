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
import { MiningSitesTransportResponseDto } from "./dto/mining-sites-transport-response.dto";
import { FindStatisticsDto } from "./dto/find-statistics.dto";
import { FindAllAiCamerasDto } from "src/ai-cameras/dto/find-all-ai-cameras.dto";
import { AiCamerasRepository } from "src/ai-cameras/infrastructure/persistence/ai-cameras.repository";
import { MiningSitesMaterialsResponseDto } from "./dto/mining-sites-materials-response.dto";

@Injectable()
export class MiningSitesService {
  constructor(
    // Dependencies here
    private readonly miningSitesRepository: MiningSitesRepository,
    private readonly aiCamerasRepository: AiCamerasRepository,
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

  async getStatistics(
    siteId: string,
    query: FindStatisticsDto,
  ): Promise<MiningSitesStatisticsResponseDto> {
    const dateFilter = query.date ?? new Date().toISOString().slice(0, 10);

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

  async getTransport(siteId: string): Promise<MiningSitesTransportResponseDto> {
    return {
      siteId,
      lastUpdated: new Date().toISOString(),
      hourlyData: [
        { hour: "6 AM", value: 7.0 },
        { hour: "7 AM", value: 7.5 },
        { hour: "8 AM", value: 8.0 },
        { hour: "9 AM", value: 8.5 },
        { hour: "10 AM", value: 9.2 },
        { hour: "11 AM", value: 8.8 },
        { hour: "12 PM", value: 8.0 },
        { hour: "1 PM", value: 7.9 },
        { hour: "2 PM", value: 8.1 },
        { hour: "3 PM", value: 8.3 },
        { hour: "4 PM", value: 7.7 },
        { hour: "5 PM", value: 7.4 },
      ],
      currentHour: {
        value: 8.2,
        unit: "tons",
      },
      dailyAverage: {
        value: 7.6,
        unit: "tons/hr",
      },
      peakHours: {
        range: "10-12 AM",
      },
      efficiency: {
        percentage: 94.3,
      },
    };
  }


  async getLiveAiCameras(
    query: FindAllAiCamerasDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};
    if (query.site_id) {
      filter.site_id = query.site_id;
    }
    if (query.status) {
      filter.status = query.status;
    }
  
    const [entities, total] = await Promise.all([
      this.aiCamerasRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.aiCamerasRepository.countWithFilter(filter),
    ]);
  
    return { entities, total };
  }



  async getMaterials(siteId: string): Promise<MiningSitesMaterialsResponseDto> {
    return {
      siteId,
      lastUpdated: new Date().toISOString(),
      materials: [
        {
          name: "Gold Ore",
          percentage: 42.3,
          price: "1842",
          unit: "oz",
        },
        {
          name: "Silver Ore",
          percentage: 31.8,
          price: "23.5",
          unit: "oz",
        },
        {
          name: "Copper",
          percentage: 18.4,
          price: "4.12",
          unit: "lb",
        },
        {
          name: "Other Minerals",
          percentage: 7.5,
          price: "Various",
          unit: "",
        },
      ],
    };
  }
}
