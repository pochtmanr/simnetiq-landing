import { deploymentEnvironment, parseExportKeys } from "./keys";
import type { BosDeps } from "./handler";
import { PgExportStore, PgNonceStore } from "./postgres";

const cache = new Map<string, unknown>();

export function productionDeps(): BosDeps {
  const environment = deploymentEnvironment(process.env.BOS_ENVIRONMENT);
  if (!environment) throw new Error("deployment environment is not configured");
  if (!process.env.BOS_READER_DATABASE_URL) throw new Error("reader database is not configured");
  const limit = Number(process.env.BOS_RATE_LIMIT_PER_MINUTE ?? "60");
  return {
    store: new PgExportStore(),
    nonceStore: new PgNonceStore(),
    keys: parseExportKeys(process.env.BOS_EXPORT_KEYS),
    now: () => new Date(),
    environment,
    projectId: "smscode",
    testTransport: process.env.BOS_TEST_TRANSPORT === "1",
    rateLimit: Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 60,
    cache,
  };
}
