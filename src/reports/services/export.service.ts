import { Injectable, Logger } from '@nestjs/common';
import { ReportType } from '../domain/reports';
import { DataPreparationService, DataPreparationOptions, PreparedReportData } from './data-preparation.service';
import { PdfGenerationService, PdfGenerationOptions } from './pdf-generation.service';
import { ExcelGenerationService, ExcelGenerationOptions } from './excel-generation.service';
import { ExportFormat } from './report-queue.service';

export interface ExportOptions {
  reportType: ReportType;
  exportFormat: ExportFormat;
  startDate: string;
  endDate: string;
  siteId?: string;
  provinceId?: string;
  generatedBy: string;
  reportName?: string;
  reportOptions?: any;
  contentMetadata?: any;
}

export interface ExportResult {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(
    private readonly dataPreparationService: DataPreparationService,
    private readonly pdfGenerationService: PdfGenerationService,
    private readonly excelGenerationService: ExcelGenerationService,
  ) {}

  async exportReport(options: ExportOptions): Promise<ExportResult> {
    this.logger.log(`Starting export: ${options.reportType} as ${options.exportFormat}`);

    try {
      // Step 1: Prepare data for the report
      this.logger.log('Preparing data for report generation...');
      const preparedData = await this.dataPreparationService.prepareReportData({
        reportType: options.reportType,
        startDate: options.startDate,
        endDate: options.endDate,
        siteId: options.siteId,
        provinceId: options.provinceId,
        generatedBy: options.generatedBy,
        reportName: options.reportName,
        reportOptions: options.reportOptions,
      });

      // Step 2: Generate file based on format
      let buffer: Buffer;
      let filename: string;
      let mimeType: string;

      switch (options.exportFormat) {
        case ExportFormat.PDF:
          buffer = await this.generatePdf(preparedData, options);
          filename = this.generateFilename(preparedData, 'pdf');
          mimeType = 'application/pdf';
          break;
        case ExportFormat.EXCEL:
        case ExportFormat.XLSX:
          buffer = await this.generateExcel(preparedData, options);
          filename = this.generateFilename(preparedData, 'xlsx');
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case ExportFormat.BOTH:
          // For 'both' format, we'll generate Excel as the primary format
          // The actual both generation is handled in the queue processor
          buffer = await this.generateExcel(preparedData, options);
          filename = this.generateFilename(preparedData, 'xlsx');
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        default:
          throw new Error(`Unsupported export format: ${options.exportFormat}`);
      }

      const result: ExportResult = {
        buffer,
        filename,
        mimeType,
        size: buffer.length,
      };

      this.logger.log(`Export completed: ${filename} (${result.size} bytes)`);
      return result;
    } catch (error) {
      this.logger.error('Error during export:', error);
      throw error;
    }
  }

  private async generatePdf(data: PreparedReportData, options: ExportOptions): Promise<Buffer> {
    this.logger.log('Generating PDF...');
    
    const pdfOptions: PdfGenerationOptions = {
      reportType: data.reportType,
      startDate: options.startDate,
      endDate: options.endDate,
      siteId: options.siteId,
      provinceId: options.provinceId,
      generatedBy: options.generatedBy,
      reportOptions: options.reportOptions,
      contentMetadata: options.contentMetadata,
    };

    return await this.pdfGenerationService.generateReportPdf(pdfOptions);
  }

  private async generateExcel(data: PreparedReportData, options: ExportOptions): Promise<Buffer> {
    this.logger.log('Generating Excel...');
    
    return await this.excelGenerationService.generateReportExcel(data);
  }

  private generateFilename(data: PreparedReportData, extension: string): string {
    const reportType = data.reportType.replace(/_/g, '-');
    const dateRange = `${this.formatDateForFilename(data.reportInfo.period.split(' to ')[0])}_to_${this.formatDateForFilename(data.reportInfo.period.split(' to ')[1])}`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    
    return `${reportType}-report-${dateRange}-${timestamp}.${extension}`;
  }

  private formatDateForFilename(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0].replace(/-/g, '');
  }

  // Utility method to get supported formats
  getSupportedFormats(): ExportFormat[] {
    return Object.values(ExportFormat);
  }

  // Utility method to validate export format
  isValidExportFormat(format: string): format is ExportFormat {
    return Object.values(ExportFormat).includes(format as ExportFormat);
  }

  // Utility method to get format info
  getFormatInfo(format: ExportFormat): { mimeType: string; extension: string; description: string } {
    switch (format) {
      case ExportFormat.PDF:
        return {
          mimeType: 'application/pdf',
          extension: 'pdf',
          description: 'Portable Document Format'
        };
      case ExportFormat.EXCEL:
      case ExportFormat.XLSX:
        return {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          extension: 'xlsx',
          description: 'Microsoft Excel Spreadsheet'
        };
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }
}
