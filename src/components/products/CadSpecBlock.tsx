/**
 * CadSpecBlock — programmatic CAD-style technical drawing.
 *
 * Generated from product spec data as a single SVG on bone paper. Front view +
 * top (plan) view + side view, each with dimension lines, leader ticks, and
 * monospaced numeric labels. Pure SVG — no canvas, no dependencies — so it
 * stays sharp at any zoom and renders identically in screenshots and PDFs.
 *
 * Signature treatment per spec §3 — "the page's signature visual identity".
 *
 * Note: this is the *simplified* version described in the brief. A richer
 * design-bundle implementation may replace it once /tmp/sv-design lands.
 */

interface Spec {
  widthMm: number;
  heightMm: number;
  depthMm: number;
  gaugeMm: number;
}

interface CadSpecBlockProps {
  spec: Spec;
  productName: string;
  labels: {
    front: string;
    top: string;
    side: string;
    width: string;
    height: string;
    depth: string;
    gauge: string;
    scale: string;
    units: string;
  };
}

/** Mono numeric — keeps Arabic page rendering Latin digits inside the drawing. */
function num(mm: number): string {
  return mm.toFixed(0);
}

function DimLineH({
  x1,
  x2,
  y,
  label,
  textY,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  textY?: number;
}) {
  const mid = (x1 + x2) / 2;
  const labelY = textY ?? y - 6;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} />
      <text
        x={mid}
        y={labelY}
        textAnchor="middle"
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        fontSize="10"
        letterSpacing="1.5"
        fill="currentColor"
      >
        {label}
      </text>
    </g>
  );
}

function DimLineV({
  y1,
  y2,
  x,
  label,
  textX,
}: {
  y1: number;
  y2: number;
  x: number;
  label: string;
  textX?: number;
}) {
  const mid = (y1 + y2) / 2;
  const labelX = textX ?? x + 8;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} />
      <text
        x={labelX}
        y={mid + 4}
        textAnchor="start"
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        fontSize="10"
        letterSpacing="1.5"
        fill="currentColor"
      >
        {label}
      </text>
    </g>
  );
}

function ViewLabel({ x, y, code, name }: { x: number; y: number; code: string; name: string }) {
  return (
    <g fontFamily="JetBrains Mono, ui-monospace, monospace" fill="currentColor">
      <text x={x} y={y} fontSize="10" letterSpacing="2" opacity="0.6">
        {code}
      </text>
      <text x={x} y={y + 14} fontSize="11" letterSpacing="1.5">
        {name}
      </text>
    </g>
  );
}

export function CadSpecBlock({ spec, productName, labels }: CadSpecBlockProps) {
  // Layout grid — 800×520 viewport. Three views: front (left big), top (right top), side (right bottom).
  // Dimensions are SVG units, not millimetres.
  const VB_W = 800;
  const VB_H = 520;

  // Scale: pick the longest dimension and fit to ~280 px wide for the front view.
  const longest = Math.max(spec.widthMm, spec.heightMm, spec.depthMm);
  const k = 260 / longest;

  const front = {
    x: 60,
    y: 90,
    w: spec.widthMm * k,
    h: spec.heightMm * k,
  };
  const top = {
    x: 460,
    y: 90,
    w: spec.widthMm * k,
    h: spec.depthMm * k,
  };
  const side = {
    x: 460,
    y: 300,
    w: spec.depthMm * k,
    h: spec.heightMm * k,
  };

  return (
    <svg
      data-cad-svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label={`${productName} — CAD spec drawing`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: "var(--color-ink)" }}
    >
      {/* Title block */}
      <g fontFamily="JetBrains Mono, ui-monospace, monospace" fill="currentColor">
        <text x={40} y={36} fontSize="10" letterSpacing="3" opacity="0.55">
          DWG · {labels.scale} 1:{Math.round(1 / k)} · {labels.units} MM
        </text>
        <text x={40} y={54} fontSize="14" letterSpacing="1.5">
          {productName}
        </text>
      </g>

      {/* Border frame */}
      <rect
        x={30}
        y={20}
        width={VB_W - 60}
        height={VB_H - 40}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.35"
      />

      {/* Internal divider */}
      <line
        x1={440}
        y1={60}
        x2={440}
        y2={VB_H - 40}
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.25"
      />
      <line
        x1={440}
        y1={290}
        x2={VB_W - 30}
        y2={290}
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.25"
      />

      {/* ── Front view ── */}
      <g
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinecap="square"
      >
        <rect x={front.x} y={front.y} width={front.w} height={front.h} />
        {/* Inset to hint at construction (gauge) */}
        <rect
          x={front.x + 6}
          y={front.y + 6}
          width={front.w - 12}
          height={front.h - 12}
          opacity="0.25"
          strokeDasharray="3 3"
        />
        {/* Centre cross */}
        <line
          x1={front.x + front.w / 2}
          y1={front.y - 4}
          x2={front.x + front.w / 2}
          y2={front.y + front.h + 4}
          strokeDasharray="2 4"
          opacity="0.3"
        />
        <line
          x1={front.x - 4}
          y1={front.y + front.h / 2}
          x2={front.x + front.w + 4}
          y2={front.y + front.h / 2}
          strokeDasharray="2 4"
          opacity="0.3"
        />
      </g>
      <g stroke="currentColor" strokeWidth="0.75" fill="none">
        {/* Width dimension below front */}
        <DimLineH
          x1={front.x}
          x2={front.x + front.w}
          y={front.y + front.h + 28}
          label={`${labels.width.toUpperCase()} · ${num(spec.widthMm)} MM`}
          textY={front.y + front.h + 44}
        />
        {/* Height dimension to the left of front */}
        <DimLineV
          y1={front.y}
          y2={front.y + front.h}
          x={front.x - 20}
          label=""
        />
      </g>
      <text
        x={front.x - 30}
        y={front.y + front.h / 2 + 4}
        textAnchor="middle"
        transform={`rotate(-90 ${front.x - 30} ${front.y + front.h / 2 + 4})`}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        fontSize="10"
        letterSpacing="1.5"
        fill="currentColor"
      >
        {`${labels.height.toUpperCase()} · ${num(spec.heightMm)} MM`}
      </text>
      <ViewLabel x={front.x} y={front.y + front.h + 60} code="01" name={labels.front.toUpperCase()} />

      {/* ── Top (plan) view ── */}
      <g stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="square">
        <rect x={top.x} y={top.y} width={top.w} height={top.h} />
        <line
          x1={top.x + top.w / 2}
          y1={top.y - 4}
          x2={top.x + top.w / 2}
          y2={top.y + top.h + 4}
          strokeDasharray="2 4"
          opacity="0.3"
        />
      </g>
      <g stroke="currentColor" strokeWidth="0.75" fill="none">
        <DimLineH
          x1={top.x}
          x2={top.x + top.w}
          y={top.y + top.h + 22}
          label={`${num(spec.widthMm)} MM`}
          textY={top.y + top.h + 36}
        />
        <DimLineV
          y1={top.y}
          y2={top.y + top.h}
          x={top.x + top.w + 14}
          label={`${labels.depth.toUpperCase()} · ${num(spec.depthMm)}`}
          textX={top.x + top.w + 20}
        />
      </g>
      <ViewLabel x={top.x} y={top.y + top.h + 56} code="02" name={labels.top.toUpperCase()} />

      {/* ── Side view ── */}
      <g stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="square">
        <rect x={side.x} y={side.y} width={side.w} height={side.h} />
      </g>
      <g stroke="currentColor" strokeWidth="0.75" fill="none">
        <DimLineH
          x1={side.x}
          x2={side.x + side.w}
          y={side.y + side.h + 22}
          label={`${num(spec.depthMm)} MM`}
          textY={side.y + side.h + 36}
        />
        <DimLineV
          y1={side.y}
          y2={side.y + side.h}
          x={side.x + side.w + 14}
          label={`${num(spec.heightMm)} MM`}
          textX={side.x + side.w + 20}
        />
      </g>
      <ViewLabel x={side.x} y={side.y + side.h + 56} code="03" name={labels.side.toUpperCase()} />

      {/* Gauge callout — leader from top view, pointing at the sheet edge */}
      <g
        stroke="currentColor"
        strokeWidth="0.75"
        fill="none"
        fontFamily="JetBrains Mono, ui-monospace, monospace"
      >
        <line
          x1={top.x + top.w}
          y1={top.y}
          x2={top.x + top.w + 38}
          y2={top.y - 24}
        />
        <circle
          cx={top.x + top.w}
          cy={top.y}
          r="2"
          fill="currentColor"
        />
        <text
          x={top.x + top.w + 42}
          y={top.y - 20}
          fontSize="10"
          letterSpacing="1.5"
          fill="currentColor"
        >
          {`${labels.gauge.toUpperCase()} · ${spec.gaugeMm.toFixed(1)} MM`}
        </text>
      </g>
    </svg>
  );
}
