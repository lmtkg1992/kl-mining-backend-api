import { registerAs } from "@nestjs/config";
import { IsOptional, IsString } from "class-validator";
import validateConfig from "../../utils/validate-config";

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  AI_SNAPSHOTS_API_TOKEN?: string;
}

export default registerAs("aiSnapshots", () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiToken: process.env.AI_SNAPSHOTS_API_TOKEN,
  };
});

