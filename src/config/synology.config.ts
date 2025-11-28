import { registerAs } from "@nestjs/config";
import { SynologyConfig } from "./synology-config.type";
import validateConfig from "../utils/validate-config";
import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, Min } from "class-validator";

class EnvironmentVariablesValidator {
  @IsUrl({ require_tld: false })
  @IsOptional()
  SYNO_BASE_URL: string;

  @IsString()
  @IsOptional()
  SYNO_USER: string;

  @IsString()
  @IsOptional()
  SYNO_PASS: string;

  @IsBoolean()
  @IsOptional()
  SYNO_SKIP_VERIFY: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  SYNO_TIMEOUT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  STREAMING_SERVER_URL: string;
}

export default registerAs<SynologyConfig>("synology", () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    baseUrl: process.env.SYNO_BASE_URL || "",
    username: process.env.SYNO_USER || "",
    password: process.env.SYNO_PASS || "",
    skipVerify: process.env.SYNO_SKIP_VERIFY === "true" || process.env.SYNO_SKIP_VERIFY === "1",
    timeout: process.env.SYNO_TIMEOUT ? parseInt(process.env.SYNO_TIMEOUT, 10) : 12000,
    streamingServerUrl: process.env.STREAMING_SERVER_URL || "https://streaming.klmining.codeplusvn.com",
  };
});

