import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { ReportStatus, ReportType } from "../domain/reports";

export enum ExportFormat {
  PDF = "pdf",
  EXCEL = "excel",
  XLSX = "xlsx",
  BOTH = "both", // Generate both PDF and Excel
}

export interface ReportGenerationJobData {
  reportId: string;
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

@Injectable()
export class ReportQueueService {
  private readonly logger = new Logger(ReportQueueService.name);

  constructor(@InjectQueue("report-generation") private reportQueue: Queue) {}

  async addReportGenerationJob(data: ReportGenerationJobData): Promise<void> {
    try {
      // Determine job name based on export format
      const jobName = this.getJobName(data.exportFormat);

      const job = await this.reportQueue.add(jobName, data, {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: 10,
        removeOnFail: 5,
      });

      this.logger.log(
        `Report generation job added: ${job.id} for report ${data.reportId} (${data.exportFormat})`,
      );
    } catch (error) {
      this.logger.error("Error adding report generation job:", error);
      throw error;
    }
  }

  private getJobName(exportFormat: ExportFormat): string {
    switch (exportFormat) {
      case ExportFormat.PDF:
        return "generate-pdf";
      case ExportFormat.EXCEL:
      case ExportFormat.XLSX:
        return "generate-excel";
      case ExportFormat.BOTH:
        return "generate-both";
      default:
        throw new Error(`Unsupported export format: ${exportFormat}`);
    }
  }

  async getJobStatus(jobId: string): Promise<any> {
    try {
      const job = await this.reportQueue.getJob(jobId);
      if (!job) {
        return null;
      }

      return {
        id: job.id,
        data: job.data,
        progress: job.progress(),
        state: await job.getState(),
        createdAt: new Date(job.timestamp),
        processedAt: job.processedOn ? new Date(job.processedOn) : null,
        finishedAt: job.finishedOn ? new Date(job.finishedOn) : null,
        failedReason: job.failedReason,
      };
    } catch (error) {
      this.logger.error("Error getting job status:", error);
      throw error;
    }
  }

  async getQueueStats(): Promise<any> {
    try {
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        this.reportQueue.getWaiting(),
        this.reportQueue.getActive(),
        this.reportQueue.getCompleted(),
        this.reportQueue.getFailed(),
        this.reportQueue.getDelayed(),
      ]);

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
        total:
          waiting.length +
          active.length +
          completed.length +
          failed.length +
          delayed.length,
      };
    } catch (error) {
      this.logger.error("Error getting queue stats:", error);
      throw error;
    }
  }

  async pauseQueue(): Promise<void> {
    await this.reportQueue.pause();
    this.logger.log("Report generation queue paused");
  }

  async resumeQueue(): Promise<void> {
    await this.reportQueue.resume();
    this.logger.log("Report generation queue resumed");
  }

  async clearQueue(): Promise<void> {
    await this.reportQueue.empty();
    this.logger.log("Report generation queue cleared");
  }
}
