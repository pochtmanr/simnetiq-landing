import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GA_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export interface GaReportRequest {
  propertyId: string;
  dimensions: string[];
  metrics: string[];
  startDate: string;
  endDate: string;
  limit: number;
  offset: number;
}

export interface GaReportPage {
  rows: Array<{ dimensions: string[]; metrics: string[] }>;
  rowCount: number;
  otherRow: boolean;
  sampled: boolean;
}

export interface GscQueryRequest {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions: string[];
  searchType: string;
  aggregationType: string;
  rowLimit: number;
  startRow: number;
}

export interface GscQueryPage {
  rows: Array<{ keys: string[]; clicks: number; impressions: number; position: number }>;
  responseAggregationType: string | null;
  firstIncompleteDate: string | null;
}

function base64url(value: Buffer | string): string {
  return Buffer.from(value).toString("base64url");
}

export function serviceAccountAssertion(input: {
  clientEmail: string;
  privateKey: string;
  scopes: string[];
  now: Date;
}): string {
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const issued = Math.floor(input.now.getTime() / 1000);
  const payload = base64url(JSON.stringify({
    iss: input.clientEmail,
    scope: input.scopes.join(" "),
    aud: TOKEN_URL,
    iat: issued,
    exp: issued + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const key = input.privateKey.includes("\\n") ? input.privateKey.replace(/\\n/g, "\n") : input.privateKey;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key);
  return `${unsigned}.${base64url(signature)}`;
}

export async function googleAccessToken(input: {
  clientEmail: string;
  privateKey: string;
  scopes: string[];
  now: Date;
  fetchImpl?: typeof fetch;
}): Promise<string> {
  const assertion = serviceAccountAssertion(input);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const response = await (input.fetchImpl ?? fetch)(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error("google token request failed");
  const parsed = await response.json() as { access_token?: string };
  if (!parsed.access_token) throw new Error("google token response had no access token");
  return parsed.access_token;
}

export function gaScopes(): string[] {
  return [GA_SCOPE];
}

export function gscScopes(): string[] {
  return [GSC_SCOPE];
}

export async function runGaReport(input: GaReportRequest & {
  accessToken: string;
  fetchImpl?: typeof fetch;
}): Promise<GaReportPage> {
  const response = await (input.fetchImpl ?? fetch)(
    `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(input.propertyId)}:runReport`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${input.accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        dimensions: input.dimensions.map((name) => ({ name })),
        metrics: input.metrics.map((name) => ({ name })),
        dateRanges: [{ startDate: input.startDate, endDate: input.endDate }],
        limit: String(input.limit),
        offset: String(input.offset),
        returnPropertyQuota: true,
        keepEmptyRows: false,
      }),
    },
  );
  if (!response.ok) throw new Error("ga4 report request failed");
  const parsed = await response.json() as {
    rows?: Array<{ dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }>;
    rowCount?: number;
    metadata?: { dataLossFromOtherRow?: boolean; samplingMetadatas?: unknown[] };
  };
  return {
    rows: (parsed.rows ?? []).map((row) => ({
      dimensions: (row.dimensionValues ?? []).map((value) => value.value ?? ""),
      metrics: (row.metricValues ?? []).map((value) => value.value ?? ""),
    })),
    rowCount: parsed.rowCount ?? (parsed.rows?.length ?? 0),
    otherRow: parsed.metadata?.dataLossFromOtherRow === true,
    sampled: Array.isArray(parsed.metadata?.samplingMetadatas) && parsed.metadata.samplingMetadatas.length > 0,
  };
}

export async function querySearchAnalytics(input: GscQueryRequest & {
  accessToken: string;
  fetchImpl?: typeof fetch;
}): Promise<GscQueryPage> {
  const response = await (input.fetchImpl ?? fetch)(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(input.siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${input.accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        startDate: input.startDate,
        endDate: input.endDate,
        dimensions: input.dimensions,
        type: input.searchType,
        aggregationType: input.aggregationType,
        rowLimit: input.rowLimit,
        startRow: input.startRow,
        dataState: "all",
      }),
    },
  );
  if (!response.ok) throw new Error("search console query failed");
  const parsed = await response.json() as {
    rows?: Array<{ keys?: string[]; clicks?: number; impressions?: number; position?: number }>;
    responseAggregationType?: string;
    metadata?: { first_incomplete_date?: string };
  };
  return {
    rows: (parsed.rows ?? []).map((row) => ({
      keys: row.keys ?? [],
      clicks: Math.round(row.clicks ?? 0),
      impressions: Math.round(row.impressions ?? 0),
      position: row.position ?? 0,
    })),
    responseAggregationType: parsed.responseAggregationType ?? null,
    firstIncompleteDate: parsed.metadata?.first_incomplete_date ?? null,
  };
}
