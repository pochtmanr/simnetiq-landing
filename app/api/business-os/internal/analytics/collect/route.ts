import { collectHandlerDeps, handleAnalyticsCollect } from "@/lib/business-os/analytics/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return handleAnalyticsCollect(request, collectHandlerDeps());
}

export function POST(request: Request) {
  return handleAnalyticsCollect(request, collectHandlerDeps());
}
