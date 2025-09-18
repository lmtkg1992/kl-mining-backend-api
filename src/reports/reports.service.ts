import { AdminUsersService } from "../admin-users/admin-users.service";
import { AdminUsers } from "../admin-users/domain/admin-users";

import { ProvincesService } from "../provinces/provinces.service";
import { Provinces } from "../provinces/domain/provinces";

import { MiningSitesService } from "../mining-sites/mining-sites.service";
import { MiningSites } from "../mining-sites/domain/mining-sites";

import {
  // common
  Injectable,
  forwardRef,
  Inject,
  UnprocessableEntityException,
  HttpStatus,
} from "@nestjs/common";
import { CreateReportsDto } from "./dto/create-reports.dto";
import { UpdateReportsDto } from "./dto/update-reports.dto";
import { ReportsRepository } from "./infrastructure/persistence/reports.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Reports } from "./domain/reports";
import { FindAllReportsDto } from "./dto/find-all-reports.dto";

@Injectable()
export class ReportsService {
  constructor(
    @Inject(forwardRef(() => AdminUsersService))
    private readonly adminUsersService: AdminUsersService,
    @Inject(forwardRef(() => ProvincesService))
    private readonly provincesService: ProvincesService,
    @Inject(forwardRef(() => MiningSitesService))
    private readonly miningSitesService: MiningSitesService,
    // Dependencies here
    private readonly reportsRepository: ReportsRepository,
  ) {}

  async create(createReportsDto: CreateReportsDto) {
    // Do not remove comment below.
    // <creating-property />

    const generatedByObject = await this.adminUsersService.findById(
      createReportsDto.generated_by,
    );
    if (!generatedByObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          generated_by: "notExists",
        },
      });
    }
    const generatedBy = generatedByObject;

    const province_idObject = await this.provincesService.findById(
      createReportsDto.province_id,
    );
    if (!province_idObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          province_id: "notExists",
        },
      });
    }
    const province_id = province_idObject;

    const site_idObject = await this.miningSitesService.findById(
      createReportsDto.site_id,
    );
    if (!site_idObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          site_id: "notExists",
        },
      });
    }
    const site_id = site_idObject;

    return this.reportsRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />

      content_metadata: createReportsDto.content_metadata,

      file_metadata: createReportsDto.file_metadata,

      file_url: createReportsDto.file_url,

      comments: createReportsDto.comments,

      report_options: createReportsDto.report_options,

      status: createReportsDto.status,

      export_format: createReportsDto.export_format,

      snapshots: createReportsDto.snapshots,

      generated_at: new Date(createReportsDto.generated_at),

      end_date: new Date(createReportsDto.end_date),

      start_date: new Date(createReportsDto.start_date),

      generated_by: generatedBy,

      province_id,

      site_id,

      report_type: createReportsDto.report_type,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.reportsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllReportsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};
    if (query.site_id) {
      filter["site_id"] = query.site_id;
    }
    if (query.province_id) {
      filter["province_id"] = query.province_id;
    }

    const [entities, total] = await Promise.all([
      this.reportsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.reportsRepository.countWithFilter(filter),
    ]);

    return { entities, total };
  }

  findById(id: Reports["id"]) {
    return this.reportsRepository.findById(id);
  }

  findByIds(ids: Reports["id"][]) {
    return this.reportsRepository.findByIds(ids);
  }

  async update(
    id: Reports["id"],

    updateReportsDto: UpdateReportsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let generated_by: AdminUsers | undefined = undefined;

    if (updateReportsDto.generated_by) {
      const generated_byObject = await this.adminUsersService.findById(
        updateReportsDto.generated_by,
      );
      if (!generated_byObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            generated_by: "notExists",
          },
        });
      }
      generated_by = generated_byObject;
    }

    let province_id: Provinces | undefined = undefined;

    if (updateReportsDto.province_id) {
      const province_idObject = await this.provincesService.findById(
        updateReportsDto.province_id,
      );
      if (!province_idObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            province_id: "notExists",
          },
        });
      }
      province_id = province_idObject;
    }

    let site_id: MiningSites | undefined = undefined;

    if (updateReportsDto.site_id) {
      const site_idObject = await this.miningSitesService.findById(
        updateReportsDto.site_id,
      );
      if (!site_idObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            site_id: "notExists",
          },
        });
      }
      site_id = site_idObject;
    }

    return this.reportsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      generated_by,

      content_metadata: updateReportsDto.content_metadata,

      file_metadata: updateReportsDto.file_metadata,

      file_url: updateReportsDto.file_url,

      comments: updateReportsDto.comments,

      report_options: updateReportsDto.report_options,

      status: updateReportsDto.status,

      export_format: updateReportsDto.export_format,

      snapshots: updateReportsDto.snapshots,

      generated_at: updateReportsDto.generated_at,

      end_date: updateReportsDto.end_date,

      start_date: updateReportsDto.start_date,

      province_id,

      site_id,

      report_type: updateReportsDto.report_type,
    });
  }

  remove(id: Reports["id"]) {
    return this.reportsRepository.remove(id);
  }

  getReportSummary(type: string, id?: string) {
    return this.reportsRepository.getReportSummary(type, id ?? "");
  }
}
