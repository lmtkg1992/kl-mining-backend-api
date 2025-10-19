export interface QueueConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  defaultJobOptions: {
    removeOnComplete: number;
    removeOnFail: number;
    attempts: number;
    backoff: {
      type: string;
      delay: number;
    };
  };
}
