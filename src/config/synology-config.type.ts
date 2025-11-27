export type SynologyConfig = {
  baseUrl: string;
  username: string;
  password: string;
  skipVerify: boolean;
  timeout: number;
  streamingServerUrl?: string; // URL của nginx streaming server (Server 2)
};

