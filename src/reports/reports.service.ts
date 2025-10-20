import { AdminUsersService } from "../admin-users/admin-users.service";
import { AdminUsers } from "../admin-users/domain/admin-users";

import { ProvincesService } from "../provinces/provinces.service";
import { Provinces } from "../provinces/domain/provinces";

import { MiningSitesService } from "../mining-sites/mining-sites.service";
import { MiningSites } from "../mining-sites/domain/mining-sites";

import { FileStorageService } from "./services/file-storage.service";

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
    private readonly fileStorageService: FileStorageService,
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

    let province_id: Provinces | null = null;

    try {
      const province_idObject = await this.provincesService.findById(
        createReportsDto.province_id,
      );
      if (province_idObject) {
        province_id = province_idObject;
      }
    } catch (error) {
      province_id = null;
    }

    let site_id: MiningSites | null = null;
    try {
      const site_idObject = await this.miningSitesService.findById(
        createReportsDto.site_id,
      );
      if (site_idObject) {
        site_id = site_idObject;
      }
    } catch (error) {
      site_id = null;
    }

    // Generate report name if not provided
    let report_name = createReportsDto.report_name;
    if (!report_name && site_id) {
      report_name = `${site_id.site_name} - ${createReportsDto.report_type.replace("_", " ").toUpperCase()} Report`;
    } else if (!report_name) {
      report_name = `${createReportsDto.report_type.replace("_", " ").toUpperCase()} Report`;
    }

    return this.reportsRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />

      content_metadata: createReportsDto.content_metadata,

      file_metadata: createReportsDto.file_metadata,

      file_url: createReportsDto.file_url || null,

      comments: createReportsDto.comments,

      report_options: createReportsDto.report_options,

      status: createReportsDto.status,

      export_format: createReportsDto.export_format,

      report_name: report_name,

      snapshots: createReportsDto.snapshots,

      generated_at: new Date(),

      end_date: new Date(createReportsDto.end_date),

      start_date: new Date(createReportsDto.start_date),

      generated_by: generatedBy,

      province_id: province_id ?? null,

      site_id: site_id ?? null,

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

    let province_id: Provinces | null = null;

    if (updateReportsDto.province_id) {
      try {
        const province_idObject = await this.provincesService.findById(
          updateReportsDto.province_id,
        );
        if (province_idObject) {
          province_id = province_idObject;
        }
      } catch (error) {
        province_id = null;
      }
    }

    let site_id: MiningSites | null = null;

    if (updateReportsDto.site_id) {
      try {
        const site_idObject = await this.miningSitesService.findById(
          updateReportsDto.site_id,
        );
        if (site_idObject) {
          site_id = site_idObject;
        }
      } catch (error) {
        site_id = null;
      }
    }

    return this.reportsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      generated_by,

      content_metadata: updateReportsDto.content_metadata,

      file_metadata: updateReportsDto.file_metadata,

      file_url: updateReportsDto.file_url || null,

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

  async getReportWithSignedUrls(id: string): Promise<Reports> {
    const report = await this.findById(id);

    if (!report) {
      throw new Error("Report not found");
    }

    if (report.file_url) {
      // Always convert to signed URLs for object format
      report.file_url = await this.fileStorageService.getSignedUrls(
        report.file_url,
      );
    }

    return report;
  }

  async getAllReportsWithSignedUrls(reports: Reports[]): Promise<Reports[]> {
    return Promise.all(
      reports.map(async (report) => {
        if (report.file_url) {
          // Always convert to signed URLs for object format
          report.file_url = await this.fileStorageService.getSignedUrls(
            report.file_url,
          );
        }
        return report;
      }),
    );
  }
}
