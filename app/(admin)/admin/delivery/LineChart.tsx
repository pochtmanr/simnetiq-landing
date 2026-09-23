/* ---------------------------------------------------------------------------
 * A small inline-SVG line chart for the delivery screen.
 *
 * Inline rather than a chart library because the panel has no chart
 * dependency and needs exactly two lines drawn: success % per hour and the
 * OnlineSim balance. Null points break the line instead of being drawn as
 * zero — an hour with no issued numbers has no success rate, and a line
 * diving to 0% there would read as an outage.
 * ------------------------------------------------------------------------ */

export type Point = { t: number; v: number | null };

const W = 720;
const H = 160;
const PAD = { top: 10, right: 12, bottom: 22, left: 40 };

function segments(points: Point[]): Point[][] {
  const out: Point[][] = [];
  let run: Point[] = [];
  for (const p of points) {
    if (p.v === null) {
      if (run.length) out.push(run);
      run = [];
    } else {
      run.push(p);
    }
  }
  if (run.length) out.push(run);
  return out;
}

function day(t: number): string {
  return new Date(t).toISOString().slice(5, 10);
}

export default function LineChart({
  points,
  yMin,
  yMax,
  format,
  label,
}: {
  points: Point[];
  /** Fixed bounds (e.g. 0–100 for a percentage); derived from data if absent. */
  yMin?: number;
  yMax?: number;
  format: (v: number) => string;
  label: string;
}) {
  const values = points.map((p) => p.v).filter((v): v is number => v !== null);
  if (points.length < 2 || values.length === 0) {
    return <p className="text-body text-ink-muted">No data in this window yet.</p>;
  }

  const t0 = points[0].t;
  const t1 = points[points.length - 1].t;
  let lo = yMin ?? Math.min(...values);
  let hi = yMax ?? Math.max(...values);
  if (hi === lo) {
    hi += 1;
    lo = Math.max(0, lo - 1);
  }

  const x = (t: number) =>
    PAD.left + ((t - t0) / Math.max(t1 - t0, 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) =>
    PAD.top + (1 - (v - lo) / (hi - lo)) * (H - PAD.top - PAD.bottom);

  const ticks = [lo, (lo + hi) / 2, hi];
  const dayTicks: number[] = [];
  const DAY = 24 * 3600_000;
  for (let t = Math.ceil(t0 / DAY) * DAY; t <= t1; t += DAY) dayTicks.push(t);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={label}
    >
      {ticks.map((v) => (
        <g key={v}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(v)}
            y2={y(v)}
            className="stroke-border"
            strokeWidth={1}
          />
          <text
            x={PAD.left - 6}
            y={y(v) + 4}
            textAnchor="end"
            className="fill-muted text-[10px] tabular-nums"
          >
            {format(v)}
          </text>
        </g>
      ))}
      {dayTicks.length <= 14 &&
        dayTicks.map((t) => (
          <text
            key={t}
            x={x(t)}
            y={H - 6}
            textAnchor="middle"
            className="fill-muted text-[10px] tabular-nums"
          >
            {day(t)}
          </text>
        ))}
      {segments(points).map((run) =>
        run.length === 1 ? (
          <circle
            key={run[0].t}
            cx={x(run[0].t)}
            cy={y(run[0].v as number)}
            r={2.5}
            className="fill-accent-deep"
          />
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
    </svg>
  );
}
