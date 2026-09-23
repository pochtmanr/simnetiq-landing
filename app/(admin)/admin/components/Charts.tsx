"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

/* ---------------------------------------------------------------------------
 * Small inline-SVG charts.
 *
 * Inline rather than a chart library because the panel has no chart
 * dependency and needs exactly two shapes: a line and signed bars. The SVG is
 * drawn at the container's real pixel width (measured, not a fixed viewBox
 * scaled down), so axis labels stay 10px on a phone instead of shrinking to
 * unreadable. Tap or hover a point to read its exact value.
 *
 * Null points break a line instead of being drawn as zero — an hour with no
 * issued numbers has no success rate, and a line diving to 0% there would
 * read as an outage.
 * ------------------------------------------------------------------------ */

export type Point = { t: number; v: number | null };

const PAD = { top: 22, right: 10, bottom: 22, left: 46 };

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

function segments(points: Point[]): Point[][] {
  const out: Point[][] = [];
  let run: Point[] = [];
  for (const p of points) {
    if (p.v === null) {
      if (run.length) out.push(run);
      run = [];
    } else run.push(p);
  }
  if (run.length) out.push(run);
  return out;
}

function tickLabel(t: number, hourly: boolean): string {
  const iso = new Date(t).toISOString();
  return hourly ? `${iso.slice(11, 13)}:00` : iso.slice(5, 10);
}

function timeTicks(t0: number, t1: number, plotW: number): { ticks: number[]; hourly: boolean } {
  const span = t1 - t0;
  const HOUR = 3600_000;
  const DAY = 24 * HOUR;
  const hourly = span <= 2 * DAY;
  const maxTicks = Math.max(2, Math.floor(plotW / 56));
  const unit = hourly ? HOUR : DAY;
  const step = Math.max(1, Math.ceil(span / unit / maxTicks)) * unit;
  const ticks: number[] = [];
  for (let t = Math.ceil(t0 / step) * step; t <= t1; t += step) ticks.push(t);
  return { ticks, hourly };
}

function Readout({ x, width, text }: { x: number; width: number; text: string }) {
  const w = Math.min(width - 4, text.length * 6.4 + 14);
  const left = Math.min(Math.max(x - w / 2, 2), width - w - 2);
  return (
    <g pointerEvents="none">
      <rect x={left} y={1} width={w} height={17} rx={5} className="fill-ink" />
      <text x={left + w / 2} y={13} textAnchor="middle" className="fill-white text-[10.5px] tabular-nums">
        {text}
      </text>
    </g>
  );
}

export function LineChart({
  points,
  yMin,
  yMax,
  format,
  label,
  height = 170,
}: {
  points: Point[];
  /** Fixed bounds (e.g. 0–100 for a percentage); derived from data if absent. */
  yMin?: number;
  yMax?: number;
  format: (v: number) => string;
  label: string;
  height?: number;
}) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const values = points.map((p) => p.v).filter((v): v is number => v !== null);
  const empty = points.length < 2 || values.length === 0;

  const W = Math.max(width, 200);
  const H = height;
  const plotW = W - PAD.left - PAD.right;
  const t0 = empty ? 0 : points[0].t;
  const t1 = empty ? 1 : points[points.length - 1].t;
  let lo = yMin ?? (empty ? 0 : Math.min(...values));
  let hi = yMax ?? (empty ? 1 : Math.max(...values));
  if (hi === lo) {
    hi += 1;
    lo = Math.max(0, lo - 1);
  }
  const x = (t: number) => PAD.left + ((t - t0) / Math.max(t1 - t0, 1)) * plotW;
  const y = (v: number) => PAD.top + (1 - (v - lo) / (hi - lo)) * (H - PAD.top - PAD.bottom);

  function onMove(e: PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let best = -1;
    let bestD = Infinity;
    points.forEach((p, i) => {
      if (p.v === null) return;
      const d = Math.abs(x(p.t) - px);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setHover(best >= 0 ? best : null);
  }

  const { ticks, hourly } = timeTicks(t0, t1, plotW);
  const hp = hover !== null ? points[hover] : null;

  return (
    <div ref={ref} className="w-full">
      {empty ? (
        <p className="text-body text-ink-muted">No data in this window yet.</p>
      ) : width === 0 ? (
        <div style={{ height: H }} />
      ) : (
        <svg
          width={W}
          height={H}
          role="img"
          aria-label={label}
          className="block touch-pan-y select-none"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {[lo, (lo + hi) / 2, hi].map((v) => (
            <g key={v}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} className="stroke-border" strokeWidth={1} />
              <text x={PAD.left - 6} y={y(v) + 3.5} textAnchor="end" className="fill-muted text-[10px] tabular-nums">
                {format(v)}
              </text>
            </g>
          ))}
          {ticks.map((t) => (
            <text key={t} x={x(t)} y={H - 6} textAnchor="middle" className="fill-muted text-[10px] tabular-nums">
              {tickLabel(t, hourly)}
            </text>
          ))}
          {segments(points).map((run) =>
            run.length === 1 ? (
              <circle key={run[0].t} cx={x(run[0].t)} cy={y(run[0].v as number)} r={2.5} className="fill-accent-deep" />
            ) : (
              <polyline
                key={run[0].t}
                points={run.map((p) => `${x(p.t)},${y(p.v as number)}`).join(" ")}
                fill="none"
                className="stroke-accent-deep"
                strokeWidth={1.75}
                strokeLinejoin="round"
              />
            ),
          )}
          {hp && hp.v !== null ? (
            <>
              <line x1={x(hp.t)} x2={x(hp.t)} y1={PAD.top} y2={H - PAD.bottom} className="stroke-muted" strokeDasharray="3 3" />
              <circle cx={x(hp.t)} cy={y(hp.v)} r={3.5} className="fill-accent-deep stroke-white" strokeWidth={1.5} />
              <Readout x={x(hp.t)} width={W} text={`${tickLabel(hp.t, hourly)} · ${format(hp.v)}`} />
            </>
          ) : null}
        </svg>
      )}
    </div>
  );
}

export type Bar = { t: number; v: number | null; /** optional second value drawn as a dot */ line?: number | null };

/**
 * Signed bars (profit can be negative) with an optional overlay of dots — e.g.
 * profit bars with revenue dots. Positive bars are good-toned, negative
 * bad-toned; the zero line is always drawn.
 */
export function BarChart({
  bars,
  format,
  label,
  lineLabel,
  barLabel,
  height = 190,
}: {
  bars: Bar[];
  format: (v: number) => string;
  label: string;
  barLabel: string;
  lineLabel?: string;
  height?: number;
}) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const vals = bars.flatMap((b) => [b.v, b.line]).filter((v): v is number => v !== null && v !== undefined);
  const empty = bars.length === 0 || vals.length === 0;

  const W = Math.max(width, 200);
  const H = height;
  const plotW = W - PAD.left - PAD.right;
  let lo = Math.min(0, ...vals);
  let hi = Math.max(0, ...vals);
  if (hi === lo) hi = lo + 1;
  const padV = (hi - lo) * 0.08;
  hi += hi > 0 ? padV : 0;
  lo -= lo < 0 ? padV : 0;
  const y = (v: number) => PAD.top + (1 - (v - lo) / (hi - lo)) * (H - PAD.top - PAD.bottom);
  const slot = plotW / Math.max(bars.length, 1);
  const bw = Math.max(2, Math.min(28, slot * 0.7));
  const cx = (i: number) => PAD.left + slot * i + slot / 2;
  const t0 = bars[0]?.t ?? 0;
  const t1 = bars[bars.length - 1]?.t ?? 1;
  const hourly = t1 - t0 <= 2 * 24 * 3600_000;
  const every = Math.max(1, Math.ceil(bars.length / Math.max(2, Math.floor(plotW / 56))));

  function onMove(e: PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.floor((e.clientX - rect.left - PAD.left) / slot);
    setHover(i >= 0 && i < bars.length ? i : null);
  }

  const hb = hover !== null ? bars[hover] : null;
  let readout = "";
  if (hb) {
    readout = `${tickLabel(hb.t, hourly)} · ${barLabel} ${hb.v === null ? "—" : format(hb.v)}`;
    if (lineLabel && hb.line !== undefined) readout += ` · ${lineLabel} ${hb.line === null ? "—" : format(hb.line)}`;
  }

  return (
    <div ref={ref} className="w-full">
      {empty ? (
        <p className="text-body text-ink-muted">No data in this window yet.</p>
      ) : width === 0 ? (
        <div style={{ height: H }} />
      ) : (
        <>
          <svg
            width={W}
            height={H}
            role="img"
            aria-label={label}
            className="block touch-pan-y select-none"
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => setHover(null)}
          >
            {[lo, 0, hi]
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((v) => (
                <g key={v}>
                  <line
                    x1={PAD.left}
                    x2={W - PAD.right}
                    y1={y(v)}
                    y2={y(v)}
                    className={v === 0 ? "stroke-muted" : "stroke-border"}
                    strokeWidth={1}
                  />
                  <text x={PAD.left - 6} y={y(v) + 3.5} textAnchor="end" className="fill-muted text-[10px] tabular-nums">
                    {format(v)}
                  </text>
                </g>
              ))}
            {bars.map((b, i) => {
              if (b.v === null || b.v === 0) return null;
              const top = y(Math.max(b.v, 0));
              const h = Math.abs(y(b.v) - y(0));
              return (
                <rect
                  key={b.t}
                  x={cx(i) - bw / 2}
                  y={top}
                  width={bw}
                  height={Math.max(h, 1)}
                  rx={Math.min(3, bw / 3)}
                  className={b.v >= 0 ? "fill-good" : "fill-bad"}
                  opacity={hover === null || hover === i ? 0.9 : 0.45}
                />
              );
            })}
            {lineLabel
              ? bars.map((b, i) =>
                  b.line === null || b.line === undefined ? null : (
                    <circle key={`l${b.t}`} cx={cx(i)} cy={y(b.line)} r={2.6} className="fill-accent-deep" />
                  ),
                )
              : null}
            {bars.map((b, i) =>
              i % every === 0 ? (
                <text key={`x${b.t}`} x={cx(i)} y={H - 6} textAnchor="middle" className="fill-muted text-[10px] tabular-nums">
                  {tickLabel(b.t, hourly)}
                </text>
              ) : null,
            )}
            {hb ? <Readout x={cx(hover as number)} width={W} text={readout} /> : null}
          </svg>
          <div className="mt-[6px] flex flex-wrap gap-x-[14px] gap-y-[4px] text-caption text-ink-muted">
            <span className="flex items-center gap-[5px]">
              <span className="inline-block h-[9px] w-[9px] rounded-[2px] bg-good" aria-hidden />
              {barLabel} (red when negative)
            </span>
            {lineLabel ? (
              <span className="flex items-center gap-[5px]">
                <span className="inline-block h-[8px] w-[8px] rounded-full bg-accent-deep" aria-hidden />
                {lineLabel}
              </span>
            ) : null}
            <span className="text-muted">Tap a bar for exact values</span>
          </div>
        </>
      )}
    </div>
  );
}
