import { Injectable, Logger } from "@nestjs/common";
import { ReportType } from "../domain/reports";
import {
  DataPreparationService,
  DataPreparationOptions,
  PreparedReportData,
} from "./data-preparation.service";
import { TemplateServiceFactory } from "./template-services";

// Dynamic import for puppeteer to handle optional dependency
let puppeteer: any;
try {
  puppeteer = require("puppeteer");
} catch (error) {
  // Puppeteer not installed, will use fallback method
  console.warn(
    "Puppeteer not installed. PDF generation will use fallback method.",
  );
}

export interface PdfGenerationOptions {
  reportType: ReportType;
  startDate: string;
  endDate: string;
  siteId?: string;
  provinceId?: string;
  generatedBy: string;
  reportName?: string;
  reportOptions?: any;
  contentMetadata?: any;
}

@Injectable()
export class PdfGenerationService {
  private readonly logger = new Logger(PdfGenerationService.name);

  constructor(
    private readonly dataPreparationService: DataPreparationService,
    private readonly templateServiceFactory: TemplateServiceFactory,
  ) {}

  async generateReportPdf(options: PdfGenerationOptions): Promise<Buffer> {
    this.logger.log(`Generating PDF for report type: ${options.reportType}`);

    try {
      // Step 1: Prepare data for the report
      this.logger.log("Preparing data for report generation...");
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

      // Step 2: Generate HTML content using appropriate template
      this.logger.log("Generating HTML content using template...");
      const templateService = this.templateServiceFactory.getTemplateService(
        options.reportType,
      );
      const htmlContent = templateService.generateHtml(preparedData);

      // Step 3: Generate PDF using Puppeteer
      this.logger.log("Generating PDF using Puppeteer...");
      return await this.generatePdfFromHtml(htmlContent, options.reportType);
    } catch (error) {
      this.logger.error("Error generating PDF:", error);
      throw error;
    }
  }

  async generatePdfFromHtml(
    htmlContent: string,
    reportType: ReportType,
  ): Promise<Buffer> {
    if (!puppeteer) {
      // Fallback: return HTML content as text if puppeteer is not available
      this.logger.warn(
        "Puppeteer not available, returning HTML content as fallback",
      );
      return Buffer.from(htmlContent, "utf-8");
    }

    let browser: any = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      // Generate PDF with optimized settings
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          right: "20mm",
          bottom: "20mm",
          left: "20mm",
        },
        displayHeaderFooter: true,
        headerTemplate: this.getHeaderTemplate(reportType),
        footerTemplate: this.getFooterTemplate(),
      });

      this.logger.log(
        `PDF generated successfully for report type: ${reportType}`,
      );
      return pdfBuffer;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private getHeaderTemplate(reportType: ReportType): string {
    return `
      <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
        ${this.getReportTitle(reportType)}
      </div>
    `;
  }

  private getFooterTemplate(): string {
    return `
      <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span> | Generated on ${new Date().toLocaleString()}
      </div>
    `;
  }

  private getReportTitle(reportType: ReportType): string {
    switch (reportType) {
      case ReportType.CAMERA_PERFORMANCE:
        return "Camera Performance Report";
      case ReportType.BREACH_SUMMARY:
        return "Breach Summary Report";
      case ReportType.TRANSPORT_ACTIVITY:
        return "Transport Activity Report";
      case ReportType.VOLUME_TRACKING:
        return "Volume Tracking Report";
      default:
        return "Mining Report";
    }
  }
}
