import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateProvincesDto } from "./dto/create-provinces.dto";
import { UpdateProvincesDto } from "./dto/update-provinces.dto";
import { ProvincesRepository } from "./infrastructure/persistence/provinces.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Provinces } from "./domain/provinces";
import { FindAllProvincesDto } from "./dto/find-all-provinces.dto";
import { FindAllAiCamerasDto } from "../ai-cameras/dto/find-all-ai-cameras.dto";
import { AiCamerasRepository } from "../ai-cameras/infrastructure/persistence/ai-cameras.repository";
import { MiningSitesRepository } from "../mining-sites/infrastructure/persistence/mining-sites.repository";
import { ProvincesMaterialsResponseDto } from "./dto/provinces-materials-response.dto";
import { ProvincesStatisticsResponseDto } from "./dto/provinces-statistics-response.dto";
import { FindStatisticsDto } from "./dto/find-statistics.dto";

@Injectable()
export class ProvincesService {
  constructor(
    // Dependencies here
    private readonly provincesRepository: ProvincesRepository,
    private readonly miningSitesRepository: MiningSitesRepository,
    private readonly aiCamerasRepository: AiCamerasRepository,
  ) {}

  async create(createProvincesDto: CreateProvincesDto) {
    return this.provincesRepository.create({
      province_name: createProvincesDto.province_name,
      province_code: createProvincesDto.province_code,
      status: createProvincesDto.status,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.provincesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllProvincesDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entites, total] = await Promise.all([
      this.provincesRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.provincesRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: Provinces["id"]) {
    return this.provincesRepository.findById(id);
  }

  findByIds(ids: Provinces["id"][]) {
    return this.provincesRepository.findByIds(ids);
  }

  async update(
    id: Provinces["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateProvincesDto: UpdateProvincesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.provincesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Provinces["id"]) {
    return this.provincesRepository.remove(id);
  }

  async getStatistics(
    provinceId: string,
    query: FindStatisticsDto,
  ): Promise<ProvincesStatisticsResponseDto> {
    const dateFilter = query.date ?? new Date().toISOString().slice(0, 10);

    return {
      province_id: provinceId,
      last_updated: new Date().toISOString(),
      site_status: {
        total_sites: 1,
        operational_sites: 1,
        status_text: "All system operational",
      },
      breach_alerts: {
        count: 7,
        change: -5.1,
      },
      truck_activities: {
        count: 89,
        change: 12.4,
      },
      total_volume: {
        value: 2150,
        unit: "m3",
        percentage_quota: 92,
      },
    };
  }

  async getLiveAiCameras(
    query: FindAllAiCamerasDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};
    if (query.province_id) {
      const sites = await this.miningSitesRepository.findByProvinceId(
        query.province_id,
      );
      if (sites.length) {
        filter.site_id = { $in: sites.map((site) => site.id) };
      }
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

  async getMaterials(
    provinceId: string,
  ): Promise<ProvincesMaterialsResponseDto> {
    return {
      province_id: provinceId,
      last_updated: new Date().toISOString(),
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
