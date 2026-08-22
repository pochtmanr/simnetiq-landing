import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { COMPANY, APP_NAME } from "../../lib/site";

/**
 * The share card, rendered rather than stored.
 *
 * It replaces a checked-in social-card.png that still read "SMS Activate" and
 * carried the retired eSIM mark. Generating it means the card can never drift
 * from the brand mark again — it reads the same brand-logo.svg the nav does.
 *
 * Deliberately locale-neutral: mark, wordmark, domain, no prose. Every page's
 * OG title and description already come from its own metadata, so one card
 * serves both /en and /ru.
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
          background: "#EFF1F5",
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
              by {COMPANY}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              maxWidth: 660,
              fontSize: 54,
              color: "#1E5AA8",
              lineHeight: 1.15,
              letterSpacing: -1.5,
            }}
          >
            A number for the sign-up. Not for life.
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#5B6270" }}>
            Real virtual numbers in 100+ countries · simnetiq.xyz
          </div>
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
