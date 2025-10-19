import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly s3Client: S3Client | null = null;
  private readonly bucketName: string;
  private readonly useS3: boolean;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const fileConfig = this.configService.get('file', { infer: true });
    this.useS3 = fileConfig?.driver === 's3' || fileConfig?.driver === 's3-presigned';
    
    if (this.useS3 && fileConfig?.accessKeyId && fileConfig?.secretAccessKey) {
      this.s3Client = new S3Client({
        region: fileConfig.awsS3Region || 'us-east-1',
        credentials: {
          accessKeyId: fileConfig.accessKeyId,
          secretAccessKey: fileConfig.secretAccessKey,
        },
      });
      this.bucketName = fileConfig.awsDefaultS3Bucket || 'klmining-reports';
    } else {
      this.bucketName = 'klmining-reports';
      this.logger.warn('S3 not configured, will use local storage fallback');
    }
  }

  async uploadPdf(fileName: string, pdfBuffer: Buffer): Promise<string> {
    if (this.useS3 && this.s3Client) {
      try {
        const key = `reports/${fileName}`;
        
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: pdfBuffer,
          ContentType: 'application/pdf',
          ContentDisposition: `attachment; filename="${fileName}"`,
        });

        await this.s3Client.send(command);
        
        // Generate signed URL for public access
        const signedUrl = await this.generateSignedUrl(key);
        
        this.logger.log(`PDF uploaded successfully to S3: ${signedUrl}`);
        return signedUrl;
      } catch (error) {
        this.logger.error('Error uploading PDF to S3:', error);
        this.logger.warn('Falling back to local storage');
        return this.uploadToLocalStorage(fileName, pdfBuffer);
      }
    } else {
      return this.uploadToLocalStorage(fileName, pdfBuffer);
    }
  }

  async uploadExcel(fileName: string, excelBuffer: Buffer): Promise<string> {
    if (this.useS3 && this.s3Client) {
      try {
        const key = `reports/${fileName}`;
        
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: excelBuffer,
          ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ContentDisposition: `attachment; filename="${fileName}"`,
        });

        await this.s3Client.send(command);
        
        // Generate signed URL for public access
        const signedUrl = await this.generateSignedUrl(key);
        
        this.logger.log(`Excel uploaded successfully to S3: ${signedUrl}`);
        return signedUrl;
      } catch (error) {
        this.logger.error('Error uploading Excel to S3:', error);
        this.logger.warn('Falling back to local storage');
        return this.uploadToLocalStorage(fileName, excelBuffer);
      }
    } else {
      return this.uploadToLocalStorage(fileName, excelBuffer);
    }
  }

  async uploadToLocalStorage(fileName: string, fileBuffer: Buffer): Promise<string> {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Create reports directory if it doesn't exist
      const reportsDir = path.join(process.cwd(), 'files', 'reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      const filePath = path.join(reportsDir, fileName);
      fs.writeFileSync(filePath, fileBuffer);
      
      const fileUrl = `/files/reports/${fileName}`;
      
      this.logger.log(`File saved locally: ${filePath}`);
      return fileUrl;
    } catch (error) {
      this.logger.error('Error saving file locally:', error);
      throw error;
    }
  }

  async deletePdf(fileUrl: string): Promise<void> {
    try {
      if (this.useS3 && this.s3Client && fileUrl.includes('s3.amazonaws.com')) {
        // Delete from S3
        const urlParts = fileUrl.split('/');
        const key = urlParts.slice(3).join('/'); // Remove domain parts
        
        const command = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
        
        await this.s3Client.send(command);
        this.logger.log(`PDF deleted from S3: ${fileUrl}`);
      } else {
        // Delete from local storage
        const fs = require('fs');
        const path = require('path');
        const fileName = path.basename(fileUrl);
        const filePath = path.join(process.cwd(), 'files', 'reports', fileName);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          this.logger.log(`PDF deleted locally: ${filePath}`);
        }
      }
    } catch (error) {
      this.logger.error('Error deleting PDF:', error);
      throw error;
    }
  }

  private async generateSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (this.useS3 && this.s3Client) {
      try {
        const command = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });

        const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
        this.logger.log(`Generated signed URL for key: ${key}`);
        return signedUrl;
      } catch (error) {
        this.logger.error('Error generating signed URL:', error);
        // Fallback to direct URL
        return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
      }
    } else {
      // For local storage, return the local URL
      return `/files/reports/${key.split('/').pop()}`;
    }
  }

  async getSignedUrl(fileUrl: string, expiresIn: number = 3600): Promise<string> {
    if (this.useS3 && this.s3Client && fileUrl.includes('s3.amazonaws.com')) {
      try {
        // Extract key from URL
        const urlParts = fileUrl.split('/');
        const key = urlParts.slice(3).join('/'); // Remove domain parts
        
        return await this.generateSignedUrl(key, expiresIn);
      } catch (error) {
        this.logger.error('Error generating signed URL from file URL:', error);
        return fileUrl; // Return original URL as fallback
      }
    } else {
      // For local storage or already signed URLs, return as is
      return fileUrl;
    }
  }

  async getSignedUrls(fileUrls: { pdf?: string; xlsx?: string }, expiresIn: number = 3600): Promise<{ pdf?: string; xlsx?: string }> {
    const signedUrls: { pdf?: string; xlsx?: string } = {};

    if (fileUrls.pdf) {
      signedUrls.pdf = await this.getSignedUrl(fileUrls.pdf, expiresIn);
    }

    if (fileUrls.xlsx) {
      signedUrls.xlsx = await this.getSignedUrl(fileUrls.xlsx, expiresIn);
    }

    return signedUrls;
  }

  // Helper method to convert single URL to object format
  async getSignedUrlAsObject(fileUrl: string, fileType: 'pdf' | 'xlsx', expiresIn: number = 3600): Promise<{ pdf?: string; xlsx?: string }> {
    const signedUrl = await this.getSignedUrl(fileUrl, expiresIn);
    return { [fileType]: signedUrl };
  }
}
