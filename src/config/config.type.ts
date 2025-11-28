import { AppConfig } from "./app-config.type";
import { AuthConfig } from "../auth/config/auth-config.type";
import { DatabaseConfig } from "../database/config/database-config.type";
import { FileConfig } from "../files/config/file-config.type";
import { MailConfig } from "../mail/config/mail-config.type";
import { QueueConfig } from "./queue-config.type";
import { AiSnapshotsConfig } from "../ai-snapshots/config/ai-snapshots-config.type";
import { SynologyConfig } from "./synology-config.type";

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  file: FileConfig;
  mail: MailConfig;
  queue: QueueConfig;
  aiSnapshots: AiSnapshotsConfig;
  synology: SynologyConfig;
};
