#!/usr/bin/env ts-node
/**
 * CLI command to process ai-snapshots and convert them to alerts
 * 
 * Usage:
 *   ts-node -r tsconfig-paths/register src/ai-snapshots/commands/process-snapshots-to-alerts.ts
 *   ts-node -r tsconfig-paths/register src/ai-snapshots/commands/process-snapshots-to-alerts.ts --start-date 2025-01-01
 *   ts-node -r tsconfig-paths/register src/ai-snapshots/commands/process-snapshots-to-alerts.ts --start-date 2025-01-01 --end-date 2025-01-31
 */

import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { AiSnapshotsService } from "../ai-snapshots.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const aiSnapshotsService = app.get(AiSnapshotsService);

  // Parse command line arguments
  const args = process.argv.slice(2);
  let startDate: Date | undefined;
  let endDate: Date | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--start-date" && args[i + 1]) {
      startDate = new Date(args[i + 1]);
      i++;
    } else if (args[i] === "--end-date" && args[i + 1]) {
      endDate = new Date(args[i + 1]);
      i++;
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
Usage: ts-node -r tsconfig-paths/register src/ai-snapshots/commands/process-snapshots-to-alerts.ts [options]

Options:
  --start-date <date>    Start date (ISO format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)
  --end-date <date>      End date (ISO format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)
  --help, -h             Show this help message

Examples:
  # Process all unconverted snapshots
  ts-node -r tsconfig-paths/register src/ai-snapshots/commands/process-snapshots-to-alerts.ts

  # Process snapshots from a specific date
  ts-node -r tsconfig-paths/register src/ai-snapshots/commands/process-snapshots-to-alerts.ts --start-date 2025-01-01

  # Process snapshots in a date range
  ts-node -r tsconfig-paths/register src/ai-snapshots/commands/process-snapshots-to-alerts.ts --start-date 2025-01-01 --end-date 2025-01-31
      `);
      await app.close();
      process.exit(0);
    }
  }

  try {
    console.log("Starting to process snapshots to alerts...");
    if (startDate) {
      console.log(`Start date: ${startDate.toISOString()}`);
    }
    if (endDate) {
      console.log(`End date: ${endDate.toISOString()}`);
    }

    const result = await aiSnapshotsService.processSnapshotsByDate(
      startDate,
      endDate,
    );

    console.log("\n=== Processing Complete ===");
    console.log(`Processed: ${result.processed}`);
    console.log(`Errors: ${result.errors}`);

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error("Error processing snapshots:", error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();

