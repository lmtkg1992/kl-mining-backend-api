import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "../../config/config.type";
import * as https from "https";
import { URL } from "url";

interface SynologySession {
  sid: string;
  synotoken: string;
  expiresAt: number;
}

export interface RecordingItem {
  id: number;
  cameraId: number;
  startTime: number;
  endTime: number;
  locked: boolean;
  codec?: string;
  size?: number;
}

export interface RecordingStreamResponse {
  url: string;
  headers: Record<string, string>;
}

@Injectable()
export class SynologyService {
  private readonly logger = new Logger(SynologyService.name);
  private session: SynologySession | null = null;
  private readonly config: {
    baseUrl: string;
    username: string;
    password: string;
    skipVerify: boolean;
    timeout: number;
    streamingServerUrl?: string;
  };

  // Mapping table: Camera Code -> Synology Camera ID
  // Based on actual Synology camera mapping
  private readonly CAMERA_CODE_TO_SYNOLOGY_ID: Record<string, number> = {
    'TTT-CAM01': 7,
    'TTT-CAM02': 10,
    'TTT-CAM03': 8,
    'TTT-CAM04': 13,
    'TTT-CAM05': 12,
    'TTT-CAM06': 15,
    'TTT-CAM07': 14,
    'TTT-CAM08': 17,
    'TTT-CAM09': 18,
    'TTT-CAM10': 16,
    'TTT-CAM11': 19,
    'TTT-CAM12': 20,
    'TTT-CAM13': 21,
    'TTT-CAM14': 22,
    'TTT-CAM15': 23,
    'TTT-CAM16': 24,
    'TTT-CAM17': 25,
    'TTT-CAM19': 26,
  };

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const synoConfig = this.configService.get("synology", { infer: true });
    this.config = {
      baseUrl: synoConfig?.baseUrl || "",
      username: synoConfig?.username || "",
      password: synoConfig?.password || "",
      skipVerify: synoConfig?.skipVerify || false,
      timeout: synoConfig?.timeout || 12000,
      streamingServerUrl: synoConfig?.streamingServerUrl,
    };
  }

  private async makeRequest(
    path: string,
    params: Record<string, string | number | boolean> = {},
    method: "GET" | "POST" = "GET",
    body?: Record<string, any>,
  ): Promise<any> {
    const urlObj = new URL(path, this.config.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, String(value));
    });

    const options: https.RequestOptions = {
      method,
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      headers: {
        "User-Agent": "syno-client/1.0 (nestjs)",
        ...(this.session?.synotoken && {
          SynoToken: this.session.synotoken,
          "X-SYNO-TOKEN": this.session.synotoken,
        }),
        ...(body && { "Content-Type": "application/json" }),
      },
      rejectUnauthorized: !this.config.skipVerify,
      timeout: this.config.timeout,
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            resolve(data);
          }
        });
      });

      req.on("error", (error) => {
        this.logger.error(`Request failed: ${error.message}`);
        reject(error);
      });

      req.setTimeout(this.config.timeout, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  private async login(): Promise<void> {
    if (this.session && this.session.expiresAt > Date.now()) {
      return;
    }

    try {
      // Use form data for login (as per Synology API spec)
      const formData = new URLSearchParams({
        api: "SYNO.API.Auth",
        method: "login",
        version: "7",
        account: this.config.username,
        passwd: this.config.password,
        session: "SurveillanceStation",
        format: "sid",
        enable_syno_token: "yes",
      });

      const urlObj = new URL("/webapi/entry.cgi", this.config.baseUrl);
      const options: https.RequestOptions = {
        method: "POST",
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
        path: urlObj.pathname,
        headers: {
          "User-Agent": "syno-client/1.0 (nestjs)",
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": formData.toString().length.toString(),
        },
        rejectUnauthorized: !this.config.skipVerify,
        timeout: this.config.timeout,
      };

      const response = await new Promise<any>((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            try {
              const json = JSON.parse(data);
              resolve(json);
            } catch (e) {
              reject(new Error(`Failed to parse response: ${e.message}`));
            }
          });
        });

        req.on("error", (error) => {
          this.logger.error(`Login request failed: ${error.message}`);
          reject(error);
        });

        req.setTimeout(this.config.timeout, () => {
          req.destroy();
          reject(new Error("Login request timeout"));
        });

        req.write(formData.toString());
        req.end();
      });

      if (!response.success) {
        throw new Error(`Login failed: ${JSON.stringify(response)}`);
      }

      const data = response.data || {};
      this.session = {
        sid: data.sid,
        synotoken: data.synotoken || "",
        expiresAt: Date.now() + 3600000, // 1 hour
      };

      this.logger.log("Synology login successful");
    } catch (error) {
      this.logger.error(`Synology login error: ${error.message}`);
      throw error;
    }
  }

  async getRecordings(
    cameraId: number,
    fromTime: number = 0,
    toTime: number = 0,
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ items: RecordingItem[]; total: number }> {
    await this.login();

    const params: Record<string, string | number> = {
      api: "SYNO.SurveillanceStation.Recording",
      method: "List",
      version: "6",
      offset,
      limit,
      fromTime: Math.floor(fromTime / 1000), // Convert to seconds
      toTime: Math.floor(toTime / 1000),
      cameraIds: String(cameraId),
    };

    if (this.session?.sid) {
      params._sid = this.session.sid;
    }

    try {
      const response = await this.makeRequest("/webapi/entry.cgi", params, "GET");

      if (!response.success) {
        throw new Error(`Get recordings failed: ${JSON.stringify(response)}`);
      }

      const data = response.data || {};
      const rawItems = data.events || data.recordings || data.items || [];

      // Log first item for debugging
      if (rawItems.length > 0) {
        this.logger.debug(`Sample raw recording item: ${JSON.stringify(rawItems[0], null, 2)}`);
      }

      const items: RecordingItem[] = rawItems.map((it: any) => {
        // Try to get startTime/endTime from API response
        let startTimeValue = it.startTime || it.start;
        let endTimeValue = it.endTime || it.end;

        // If startTime/endTime are not in the response, try to extract from filePath
        // Synology filePath format: "20251127PM/TTT-CAM08-20251127-212523-1764253523318-1.mp4"
        // The timestamp (1764253523318) is embedded in the filename
        // NOTE: The timestamp in filename is in LOCAL time (GMT+7), not UTC
        // We need to convert from GMT+7 to UTC by subtracting 7 hours
        if ((!startTimeValue || startTimeValue === null) && it.filePath) {
          const filePath = String(it.filePath);
          // Extract timestamp from filename: pattern is "-{timestamp}-"
          const timestampMatch = filePath.match(/-(\d{13})-/);
          if (timestampMatch && timestampMatch[1]) {
            // The timestamp in filename is in milliseconds, but in LOCAL timezone (GMT+7)
            const localTimestamp = parseInt(timestampMatch[1], 10);
            // Convert from GMT+7 to UTC (subtract 7 hours = 7 * 60 * 60 * 1000 ms)
            const GMT7_OFFSET_MS = 7 * 60 * 60 * 1000;
            startTimeValue = localTimestamp;
            
            this.logger.debug(
              `Extracted startTime from filePath: ${localTimestamp} (GMT+7) -> ${startTimeValue} (UTC) ` +
              `[${new Date(localTimestamp).toISOString()} -> ${new Date(startTimeValue).toISOString()}] (from ${filePath})`
            );
            
            // For endTime, recordings are typically 30 minutes long
            // Set endTime to startTime + 30 minutes
            if (!endTimeValue || endTimeValue === null) {
              const RECORDING_DURATION_MS = 30 * 60 * 1000; // 30 minutes in milliseconds
              endTimeValue = startTimeValue + RECORDING_DURATION_MS;
              this.logger.debug(`Estimated endTime: ${endTimeValue} (startTime + 30 minutes)`);
            }
          }
        }

        // Convert to milliseconds if values are in seconds (Unix epoch)
        // Values > 1e12 are likely already in milliseconds
        if (startTimeValue != null) {
          const numValue = typeof startTimeValue === 'number' ? startTimeValue : parseFloat(String(startTimeValue));
          startTimeValue = numValue < 1e12 ? numValue * 1000 : numValue;
        }

        if (endTimeValue != null) {
          const numValue = typeof endTimeValue === 'number' ? endTimeValue : parseFloat(String(endTimeValue));
          endTimeValue = numValue < 1e12 ? numValue * 1000 : numValue;
        }

        // Log warning if we still don't have valid times
        if (!startTimeValue || !endTimeValue || startTimeValue <= 0 || endTimeValue <= 0) {
          this.logger.warn(`Could not determine startTime/endTime for recording: ${JSON.stringify(it)}`);
        }

        return {
          id: it.id || it.eventId || it.recordId,
          cameraId: it.cameraId || cameraId,
          startTime: startTimeValue || 0,
          endTime: endTimeValue || 0,
          locked: it.locked || false,
          codec: it.videoCodec || it.codec,
          size: it.size || it.sizeByte,
        };
      });

      return {
        items,
        total: data.total || items.length,
      };
    } catch (error) {
      this.logger.error(`Get recordings error: ${error.message}`);
      throw error;
    }
  }

  async getRecordingStreamUrl(
    recordingId: number,
    dsId: number = 0,
    mountId: number = 0,
  ): Promise<RecordingStreamResponse> {
    await this.login();

    const params: Record<string, string | number> = {
      api: "SYNO.SurveillanceStation.Recording",
      method: "Stream",
      version: "6",
      recordingId,
      dsId,
      mountId,
      alertRecording: "false",
      videoCodec: "3", // H.264 (better browser support than MJPEG)
    };

    if (this.session?.sid) {
      params._sid = this.session.sid;
    }

    // Thêm token vào query string để nginx có thể forward
    const queryParams: Record<string, string | number> = { ...params };
    if (this.session?.synotoken) {
      queryParams._synotoken = this.session.synotoken;
    }

    const queryString = Object.entries(queryParams)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&");

    // Trả về URL qua nginx streaming server (Server 2) thay vì trực tiếp từ Synology
    // Nginx sẽ proxy request này đến Synology (có VPN access)
    // Token được pass qua query string để nginx có thể forward
    const streamingServerUrl = this.config.streamingServerUrl || "https://streaming.klmining.codeplusvn.com";
    const proxyUrl = `${streamingServerUrl}/recordings/?${queryString}`;

    // Headers vẫn trả về để frontend có thể dùng nếu cần
    const headers: Record<string, string> = {};
    if (this.session?.synotoken) {
      headers.SynoToken = this.session.synotoken;
      headers["X-SYNO-TOKEN"] = this.session.synotoken;
    }

    return {
      url: proxyUrl,
      headers,
    };
  }

  /**
   * Get Synology camera ID from camera code
   */
  getSynologyCameraId(cameraCode: string): number | null {
    if (!cameraCode) {
      return null;
    }

    // Try exact match first (e.g., "TTT-CAM01")
    if (this.CAMERA_CODE_TO_SYNOLOGY_ID[cameraCode]) {
      return this.CAMERA_CODE_TO_SYNOLOGY_ID[cameraCode];
    }

    // Try uppercase match
    const upperCode = cameraCode.toUpperCase();
    if (this.CAMERA_CODE_TO_SYNOLOGY_ID[upperCode]) {
      return this.CAMERA_CODE_TO_SYNOLOGY_ID[upperCode];
    }

    // Fallback: try to extract number and map (less reliable)
    const match = cameraCode.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      // Try to find by number in code name
      const codeKey = `TTT-CAM${String(num).padStart(2, '0')}`;
      if (this.CAMERA_CODE_TO_SYNOLOGY_ID[codeKey]) {
        return this.CAMERA_CODE_TO_SYNOLOGY_ID[codeKey];
      }
    }

    // If code is just a number, assume it's already Synology ID
    const numCode = parseInt(cameraCode, 10);
    if (!isNaN(numCode)) {
      return numCode;
    }

    this.logger.warn(`Could not map camera code to Synology ID: ${cameraCode}`);
    return null;
  }
}

