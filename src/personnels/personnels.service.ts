import { MiningSitesService } from "../mining-sites/mining-sites.service";
import { MiningSites } from "../mining-sites/domain/mining-sites";

import {
  // common
  Injectable,
  UnprocessableEntityException,
  HttpStatus,
} from "@nestjs/common";
import { CreatePersonnelDto } from "./dto/create-personnel.dto";
import { UpdatePersonnelDto } from "./dto/update-personnel.dto";
import { PersonnelRepository } from "./infrastructure/persistence/personnel.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Personnel } from "./domain/personnel";
import { FindAllPersonnelsDto } from "./dto/find-all-personnels.dto";

@Injectable()
export class PersonnelsService {
  constructor(
    private readonly miningSitesService: MiningSitesService,
    private readonly personnelRepository: PersonnelRepository,
  ) {}

  /**
   * Validates and resolves site IDs from DTO
   */
  private async validateAndResolveSiteIds(siteIdsDto?: any[] | null): Promise<MiningSites[] | null | undefined> {
    if (siteIdsDto) {
      const siteIdsObjects = await this.miningSitesService.findByIds(
        siteIdsDto.map((entity) => entity.id),
      );
      if (siteIdsObjects.length !== siteIdsDto.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            site_ids: "notExists",
          },
        });
      }
      return siteIdsObjects;
    } else if (siteIdsDto === null) {
      return null;
    }
    return undefined;
  }

  async create(createPersonnelDto: CreatePersonnelDto) {
    const site_ids = await this.validateAndResolveSiteIds(createPersonnelDto.site_ids);

    return this.personnelRepository.create({
      site_ids,
      phone_number: createPersonnelDto.phone_number,
      personal_email: createPersonnelDto.personal_email,
      date_joined: createPersonnelDto.date_joined,
      status: createPersonnelDto.status,
      department: createPersonnelDto.department,
      job_title: createPersonnelDto.job_title,
      avatar_url: createPersonnelDto.avatar_url,
      full_name: createPersonnelDto.full_name,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.personnelRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllPersonnelsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};

    // Add status filter
    if (query.status) {
      filter.status = query.status;
    }

    // Add department filter
    if (query.department) {
      filter.department = { $regex: query.department, $options: 'i' };
    }

    // Add search filter for full name
    if (query.search) {
      filter.full_name = { $regex: query.search, $options: 'i' };
    }

    const [entities, total] = await Promise.all([
      this.personnelRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.personnelRepository.countWithFilter(filter),
    ]);

    return { entities, total };
  }

  findById(id: Personnel["id"]) {
    return this.personnelRepository.findById(id);
  }

  findByIds(ids: Personnel["id"][]) {
    return this.personnelRepository.findByIds(ids);
  }

  async update(
    id: Personnel["id"],
    updatePersonnelDto: UpdatePersonnelDto,
  ) {
    const site_ids = await this.validateAndResolveSiteIds(updatePersonnelDto.site_ids);

    return this.personnelRepository.update(id, {
      site_ids,
      phone_number: updatePersonnelDto.phone_number,
      personal_email: updatePersonnelDto.personal_email,
      date_joined: updatePersonnelDto.date_joined,
      status: updatePersonnelDto.status,
      department: updatePersonnelDto.department,
      job_title: updatePersonnelDto.job_title,
      avatar_url: updatePersonnelDto.avatar_url,
      full_name: updatePersonnelDto.full_name,
    });
  }

  remove(id: Personnel["id"]) {
    return this.personnelRepository.remove(id);
  }
}
