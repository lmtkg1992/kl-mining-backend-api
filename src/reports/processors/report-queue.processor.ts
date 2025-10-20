import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Logger } from "@nestjs/common";
import { PdfGenerationService } from "../services/pdf-generation.service";
import { ExcelGenerationService } from "../services/excel-generation.service";
import { ExportService } from "../services/export.service";
import { FileStorageService } from "../services/file-storage.service";
import { ReportsService } from "../reports.service";
import { ReportStatus } from "../domain/reports";
import {
  ReportGenerationJobData,
  ExportFormat,
} from "../services/report-queue.service";
import { ReportType } from "../domain/reports";

@Processor("report-generation")
export class ReportQueueProcessor {
  private readonly logger = new Logger(ReportQueueProcessor.name);

  constructor(
    private readonly pdfGenerationService: PdfGenerationService,
    private readonly excelGenerationService: ExcelGenerationService,
    private readonly exportService: ExportService,
    private readonly fileStorageService: FileStorageService,
    private readonly reportsService: ReportsService,
  ) {}

  @Process("generate-pdf")
  async handlePdfGeneration(job: Job<ReportGenerationJobData>) {
    const {
      reportId,
      reportType,
      startDate,
      endDate,
      siteId,
      provinceId,
      generatedBy,
      reportName,
      reportOptions,
      contentMetadata,
    } = job.data;

    this.logger.log(`Starting PDF generation for report ${reportId}`);

    try {
      // Update report status to processing
      await this.reportsService.update(reportId, {
        status: ReportStatus.PROCESSING,
      });

      // Generate PDF content based on report type
      const pdfBuffer = await this.pdfGenerationService.generateReportPdf({
        reportType,
        startDate,
        endDate,
        siteId,
        provinceId,
        generatedBy,
        reportOptions,
        contentMetadata,
      });

      // Upload PDF to storage (try S3 first, fallback to local)
      let fileUrl: string;
      try {
        const fileName = `report_${reportId}_${Date.now()}.pdf`;
        fileUrl = await this.fileStorageService.uploadPdf(fileName, pdfBuffer);
      } catch (s3Error) {
        this.logger.warn(
          "S3 upload failed, falling back to local storage:",
          s3Error,
        );
        const fileName = `report_${reportId}_${Date.now()}.pdf`;
        fileUrl = await this.fileStorageService.uploadToLocalStorage(
          fileName,
          pdfBuffer,
        );
      }

      // Update report with file URL and completed status
      await this.reportsService.update(reportId, {
        status: ReportStatus.COMPLETED,
        file_url: {
          pdf: fileUrl,
        } as any,
        file_metadata: {
          fileName: `report_${reportId}_${Date.now()}.pdf`,
          fileSize: pdfBuffer.length,
          mimeType: "application/pdf",
          generatedAt: new Date(),
        },
      });

      this.logger.log(`PDF generation completed for report ${reportId}`);

      return {
        success: true,
        reportId,
        fileUrl,
        format: "pdf",
      };
    } catch (error) {
      this.logger.error(`PDF generation failed for report ${reportId}:`, error);

      // Update report status to failed
      await this.reportsService.update(reportId, {
        status: ReportStatus.FAILED,
        comments: `PDF generation failed: ${error.message}`,
      });

      throw error;
    }
  }

  @Process("generate-excel")
  async handleExcelGeneration(job: Job<ReportGenerationJobData>) {
    const {
      reportId,
      reportType,
      startDate,
      endDate,
      siteId,
      provinceId,
      generatedBy,
      reportName,
      reportOptions,
      contentMetadata,
    } = job.data;

    this.logger.log(`Starting Excel generation for report ${reportId}`);

    try {
      // Update report status to processing
      await this.reportsService.update(reportId, {
        status: ReportStatus.PROCESSING,
      });

      // Generate Excel content using unified export service
      const exportResult = await this.exportService.exportReport({
        reportType,
        exportFormat: ExportFormat.EXCEL,
        startDate,
        endDate,
        siteId,
        provinceId,
        generatedBy,
        reportOptions,
        contentMetadata,
      });

      // Upload Excel to storage (try S3 first, fallback to local)
      let fileUrl: string;
      try {
        fileUrl = await this.fileStorageService.uploadExcel(
          exportResult.filename,
          exportResult.buffer,
        );
      } catch (s3Error) {
        this.logger.warn(
          "S3 upload failed, falling back to local storage:",
          s3Error,
        );
        fileUrl = await this.fileStorageService.uploadToLocalStorage(
          exportResult.filename,
          exportResult.buffer,
        );
      }

      // Update report with file URL and completed status
      await this.reportsService.update(reportId, {
        status: ReportStatus.COMPLETED,
        file_url: {
          xlsx: fileUrl,
        } as any,
        file_metadata: {
          fileName: exportResult.filename,
          fileSize: exportResult.size,
          mimeType: exportResult.mimeType,
          generatedAt: new Date(),
        },
      });

      this.logger.log(`Excel generation completed for report ${reportId}`);

      return {
        success: true,
        reportId,
        fileUrl,
        format: "excel",
        filename: exportResult.filename,
        size: exportResult.size,
      };
    } catch (error) {
      this.logger.error(
        `Excel generation failed for report ${reportId}:`,
        error,
      );

      // Update report status to failed
      await this.reportsService.update(reportId, {
        status: ReportStatus.FAILED,
        comments: `Excel generation failed: ${error.message}`,
      });

      throw error;
    }
  }

  @Process("generate-both")
  async handleBothGeneration(job: Job<ReportGenerationJobData>) {
    const {
      reportId,
      reportType,
      startDate,
      endDate,
      siteId,
      provinceId,
      generatedBy,
      reportName,
      reportOptions,
      contentMetadata,
    } = job.data;

    this.logger.log(
      `Starting both PDF and Excel generation for report ${reportId}`,
    );

    try {
      // Update report status to processing
      await this.reportsService.update(reportId, {
        status: ReportStatus.PROCESSING,
      });

      // Generate both PDF and Excel
      const [pdfResult, excelResult] = await Promise.all([
        this.generatePdf(
          reportId,
          reportType,
          startDate,
          endDate,
          siteId,
          provinceId,
          generatedBy,
          reportName,
          reportOptions,
          contentMetadata,
        ),
        this.generateExcel(
          reportId,
          reportType,
          startDate,
          endDate,
          siteId,
          provinceId,
          generatedBy,
          reportName,
          reportOptions,
          contentMetadata,
        ),
      ]);

      // Update report with both file URLs and completed status
      await this.reportsService.update(reportId, {
        status: ReportStatus.COMPLETED,
        file_url: {
          pdf: pdfResult.fileUrl,
          xlsx: excelResult.fileUrl,
        } as any,
        file_metadata: {
          pdf: {
            fileName: pdfResult.fileName,
            fileSize: pdfResult.fileSize,
            mimeType: "application/pdf",
            generatedAt: new Date(),
          },
          xlsx: {
            fileName: excelResult.fileName,
            fileSize: excelResult.fileSize,
            mimeType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            generatedAt: new Date(),
          },
        },
      });

      this.logger.log(
        `Both PDF and Excel generation completed for report ${reportId}`,
      );

      return {
        success: true,
        reportId,
        files: {
          pdf: pdfResult.fileUrl,
          xlsx: excelResult.fileUrl,
        },
        format: "both",
      };
    } catch (error) {
      this.logger.error(
        `Both generation failed for report ${reportId}:`,
        error,
      );

      // Update report status to failed
      await this.reportsService.update(reportId, {
        status: ReportStatus.FAILED,
        comments: `Both generation failed: ${error.message}`,
      });

      throw error;
    }
  }

  private async generatePdf(
    reportId: string,
    reportType: ReportType,
    startDate: string,
    endDate: string,
    siteId?: string,
    provinceId?: string,
    generatedBy?: string,
    reportName?: string,
    reportOptions?: any,
    contentMetadata?: any,
  ) {
    // Generate PDF content
    const pdfBuffer = await this.pdfGenerationService.generateReportPdf({
      reportType,
      startDate,
      endDate,
      siteId: siteId || undefined,
      provinceId: provinceId || undefined,
      generatedBy: generatedBy || "",
      reportName: reportName || undefined,
      reportOptions,
      contentMetadata,
    });

    // Upload PDF to storage
    let fileUrl: string;
    try {
      const fileName = `report_${reportId}_${Date.now()}.pdf`;
      fileUrl = await this.fileStorageService.uploadPdf(fileName, pdfBuffer);
    } catch (s3Error) {
      this.logger.warn(
        "S3 upload failed, falling back to local storage:",
        s3Error,
      );
      const fileName = `report_${reportId}_${Date.now()}.pdf`;
      fileUrl = await this.fileStorageService.uploadToLocalStorage(
        fileName,
        pdfBuffer,
      );
    }

    return {
      fileUrl,
      fileName: `report_${reportId}_${Date.now()}.pdf`,
      fileSize: pdfBuffer.length,
    };
  }

  private async generateExcel(
    reportId: string,
    reportType: ReportType,
    startDate: string,
    endDate: string,
    siteId?: string,
    provinceId?: string,
    generatedBy?: string,
    reportName?: string,
    reportOptions?: any,
    contentMetadata?: any,
  ) {
    // Generate Excel content using unified export service
    const exportResult = await this.exportService.exportReport({
      reportType,
      exportFormat: ExportFormat.EXCEL,
      startDate,
      endDate,
      siteId: siteId || undefined,
      provinceId: provinceId || undefined,
      generatedBy: generatedBy || "",
      reportName: reportName || undefined,
      reportOptions,
      contentMetadata,
    });

    // Upload Excel to storage
    let fileUrl: string;
    try {
      fileUrl = await this.fileStorageService.uploadExcel(
        exportResult.filename,
        exportResult.buffer,
      );
    } catch (s3Error) {
      this.logger.warn(
        "S3 upload failed, falling back to local storage:",
        s3Error,
      );
      fileUrl = await this.fileStorageService.uploadToLocalStorage(
        exportResult.filename,
        exportResult.buffer,
      );
    }

    return {
      fileUrl,
      fileName: exportResult.filename,
      fileSize: exportResult.size,
    };
  }
}
