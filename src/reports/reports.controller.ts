import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { Response } from 'express';
import { ReportsService } from "./reports.service";
import { CreateReportsDto } from "./dto/create-reports.dto";
import { UpdateReportsDto } from "./dto/update-reports.dto";
import { GenerateReportDto } from "./dto/generate-report.dto";
import { ExportFormat } from "./services/report-queue.service";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiProduces,
} from "@nestjs/swagger";
import { Reports } from "./domain/reports";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../utils/dto/infinity-pagination-response.dto";
import { FindAllReportsDto } from "./dto/find-all-reports.dto";

import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { infinityPaginationWithMetadata } from "../utils/infinity-pagination-with-metadata";
import { ReportQueueService } from "./services/report-queue.service";
import { ExportService } from "./services/export.service";
import { ReportStatus, ReportType } from "./domain/reports";

@ApiTags("Reports")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "reports",
  version: "1",
})
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly reportQueueService: ReportQueueService,
    private readonly exportService: ExportService,
  ) {}

  @RequirePermissions("reports::create")
  @Post("create")
  @ApiCreatedResponse({
    type: Reports,
  })
  create(@Body() createReportsDto: CreateReportsDto) {
    return this.reportsService.create(createReportsDto);
  }

  @Get("list")
  @RequirePermissions("reports::list")
  @ApiOkResponse({
    type: InfinityPaginationResponse(Reports),
  })
  async findAll(
    @Query() query: FindAllReportsDto,
  ): Promise<InfinityPaginationResponseDto<Reports>> {
    let page = query?.page ?? 1;
    if (page < 1) {
      page = 1;
    }
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.reportsService.findAllWithFilterAndPagination(
      query,
      {
        page,
        limit,
      },
    );

    // Generate signed URLs for all reports
    const reportsWithSignedUrls = await this.reportsService.getAllReportsWithSignedUrls(data.entities);

    return infinityPaginationWithMetadata(reportsWithSignedUrls, data.total, {
      page,
      limit,
    });
  }

  @Get("detail/:id")
  @RequirePermissions("reports::list")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Reports,
  })
  findById(@Param("id") id: string) {
    return this.reportsService.getReportWithSignedUrls(id);
  }

  @Patch("update/:id")
  @RequirePermissions("reports::update")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Reports,
  })
  update(@Param("id") id: string, @Body() updateReportsDto: UpdateReportsDto) {
    return this.reportsService.update(id, updateReportsDto);
  }

  @Delete("delete/:id")
  @RequirePermissions("reports::delete")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.reportsService.remove(id);
  }


  @Post("export")
  @RequirePermissions("reports::create")
  @ApiCreatedResponse({
    description: "Report export job started (supports PDF, Excel, XLSX)",
  })
  async exportReport(@Body() generateReportDto: GenerateReportDto) {
    console.log('generateReportDto', generateReportDto);
    
    try {
      // Step 1: Create the report record first
      const report = await this.reportsService.create({
        ...generateReportDto,
        site_id: generateReportDto.site_id ?? '',
        province_id: generateReportDto.province_id ?? '',
        status: ReportStatus.PENDING,
        export_format: generateReportDto.export_format,
        report_name: generateReportDto.report_name,
        generated_at: new Date().toISOString(),
      });

      // Step 2: Add job to queue for report generation with data preparation
      await this.reportQueueService.addReportGenerationJob({
        reportId: report.id,
        reportType: generateReportDto.report_type,
        exportFormat: generateReportDto.export_format as ExportFormat,
        startDate: generateReportDto.start_date,
        endDate: generateReportDto.end_date,
        siteId: generateReportDto.site_id,
        provinceId: generateReportDto.province_id,
        generatedBy: generateReportDto.generated_by,
        reportName: generateReportDto.report_name,
        reportOptions: generateReportDto.report_options,
        contentMetadata: generateReportDto.content_metadata,
      });

      return {
        message: `${generateReportDto.export_format.toUpperCase()} generation job started with data preparation`,
        reportId: report.id,
        status: ReportStatus.PENDING,
        reportType: generateReportDto.report_type,
        exportFormat: generateReportDto.export_format,
        dataPreparation: "enabled",
      };
    } catch (error) {
      console.error('Error starting report generation:', error);
      throw error;
    }
  }

  @Post("export-direct")
  @RequirePermissions("reports::create")
  @ApiProduces('application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async exportReportDirect(@Body() generateReportDto: GenerateReportDto, @Res() res: Response) {
    console.log('Direct export request:', generateReportDto);
    
    try {
      // Validate export format
      if (!this.exportService.isValidExportFormat(generateReportDto.export_format)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Invalid export format',
          supportedFormats: this.exportService.getSupportedFormats(),
        });
      }

          // Generate report directly
          const exportResult = await this.exportService.exportReport({
            reportType: generateReportDto.report_type,
            exportFormat: generateReportDto.export_format,
            startDate: generateReportDto.start_date,
            endDate: generateReportDto.end_date,
            siteId: generateReportDto.site_id,
            provinceId: generateReportDto.province_id,
            generatedBy: generateReportDto.generated_by,
            reportName: generateReportDto.report_name,
            reportOptions: generateReportDto.report_options,
            contentMetadata: generateReportDto.content_metadata,
          });

      // Set response headers
      res.setHeader('Content-Type', exportResult.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
      res.setHeader('Content-Length', exportResult.size.toString());

      // Send file
      res.send(exportResult.buffer);
    } catch (error) {
      console.error('Error during direct export:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to generate report',
        message: error.message,
      });
    }
  }

  @Get("export/formats")
  @RequirePermissions("reports::list")
  @ApiOkResponse({
    description: "Supported export formats",
  })
  getSupportedFormats() {
    const formats = this.exportService.getSupportedFormats();
    const formatInfo = formats.map(format => ({
      format,
      ...this.exportService.getFormatInfo(format),
    }));

    return {
      supportedFormats: formatInfo,
      message: "Supported export formats retrieved successfully",
    };
  }

  @Get("queue/status")
  @RequirePermissions("reports::list")
  @ApiOkResponse({
    description: "Queue status information",
  })
  async getQueueStatus() {
    return this.reportQueueService.getQueueStats();
  }

  @Get("queue/job/:jobId")
  @RequirePermissions("reports::list")
  @ApiParam({
    name: "jobId",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: "Job status information",
  })
  async getJobStatus(@Param("jobId") jobId: string) {
    return this.reportQueueService.getJobStatus(jobId);
  }

  @Post("queue/pause")
  @RequirePermissions("reports::update")
  @ApiOkResponse({
    description: "Queue paused successfully",
  })
  async pauseQueue() {
    await this.reportQueueService.pauseQueue();
    return { message: "Queue paused successfully" };
  }

  @Post("queue/resume")
  @RequirePermissions("reports::update")
  @ApiOkResponse({
    description: "Queue resumed successfully",
  })
  async resumeQueue() {
    await this.reportQueueService.resumeQueue();
    return { message: "Queue resumed successfully" };
  }

  @Post("queue/clear")
  @RequirePermissions("reports::delete")
  @ApiOkResponse({
    description: "Queue cleared successfully",
  })
  async clearQueue() {
    await this.reportQueueService.clearQueue();
    return { message: "Queue cleared successfully" };
  }
}
