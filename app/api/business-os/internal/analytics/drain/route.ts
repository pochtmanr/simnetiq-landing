import { drainHandlerDeps, handleAnalyticsDrain } from "@/lib/business-os/analytics/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return handleAnalyticsDrain(request, drainHandlerDeps());
}
