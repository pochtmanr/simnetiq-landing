import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { COMPANY, APP_NAME, SITE_URL } from "../../lib/site";

const SITE_HOST = new URL(SITE_URL).host;

/**
 * The share card, rendered rather than stored.
 *
 * It replaces a checked-in social-card.png that still read "SMS Activate" and
 * carried the retired eSIM mark. Generating it means the card can never drift
 * from the brand mark again — it reads the same brand-logo.svg the nav does.
 *
 * Deliberately locale-neutral: mark, wordmark, company, domain — no prose, so
 * no locale ever shares a card in someone else's language and the renderer
 * needs no fonts beyond Latin. Every page's OG title and description already
 * come from its own metadata.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET() {
  const mark = readFileSync(
    join(process.cwd(), "public/brand/logo.svg"),
  ).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F3F4F7",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/svg+xml;base64,${mark}`}
            width={132}
            height={132}
            alt=""
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", fontSize: 68, color: "#23262C", letterSpacing: -2 }}>
              {APP_NAME}
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "#5B6270" }}>
              {COMPANY}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#5B6270" }}>
          {SITE_HOST}
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 12,
            background: "linear-gradient(90deg, #59A1FC 0%, #276CC5 100%)",
          }}
        />
      </div>
    ),
    size,
  );
}
