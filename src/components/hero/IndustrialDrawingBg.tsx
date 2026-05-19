"use client";
/**
 * IndustrialDrawingBg — faint SVG of CAD-style industrial drawings
 * (dimension lines, callouts, brackets, section views, centrelines)
 * placed behind the hero text. Slowly drifts on a CSS animation; on
 * scroll the layer parallaxes upward so the hero reads as a stack of
 * drawings being inspected rather than a static graphic.
 *
 * Render-cost: a single inline SVG (~6 KB), zero JS work after mount
 * apart from one rAF parallax listener (throttled, passive).
 *
 * Tokens used: --color-rust for emphasis, currentColor inherited from
 * the parent foreground for hairlines.
 */
import { useEffect, useRef } from "react";

export function IndustrialDrawingBg() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY * 0.18;
        el.style.transform = `translate3d(0, ${-y}px, 0)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={layerRef}
      className="sv-drawing-bg"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="sv-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
          </pattern>
          <marker id="sv-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
          <marker id="sv-arrow-rust" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-rust)" />
          </marker>
        </defs>

        {/* === Workstation plan view (top-left) === */}
        <g transform="translate(80,90)" stroke="currentColor" fill="none" strokeWidth="1">
          {/* outline */}
          <rect x="0" y="0" width="320" height="160" />
          {/* under-shelf */}
          <rect x="20" y="30" width="280" height="100" strokeDasharray="2 3" opacity="0.6" />
          {/* drain hole */}
          <circle cx="50" cy="80" r="6" />
          {/* centreline horizontal */}
          <line x1="-12" y1="80" x2="332" y2="80" strokeDasharray="14 2 2 2" opacity="0.5" />
          {/* dimension top */}
          <line x1="0" y1="-26" x2="320" y2="-26" markerStart="url(#sv-arrow)" markerEnd="url(#sv-arrow)" />
          <line x1="0" y1="-32" x2="0" y2="-20" />
          <line x1="320" y1="-32" x2="320" y2="-20" />
          <text x="160" y="-32" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="currentColor">1800 mm</text>
          {/* dimension right */}
          <line x1="346" y1="0" x2="346" y2="160" markerStart="url(#sv-arrow)" markerEnd="url(#sv-arrow)" />
          <line x1="340" y1="0" x2="352" y2="0" />
          <line x1="340" y1="160" x2="352" y2="160" />
          <text x="360" y="84" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="currentColor">750</text>
        </g>

        {/* === Section view of sheet edge (bottom-right) — with hatch === */}
        <g transform="translate(1180,640)" stroke="currentColor" fill="none" strokeWidth="1">
          <path d="M0,0 L260,0 L260,8 L0,8 Z" fill="url(#sv-hatch)" />
          <path d="M260,0 Q272,4 260,8" />
          {/* leader to spec */}
          <line x1="240" y1="-8" x2="200" y2="-50" stroke="var(--color-rust)" markerEnd="url(#sv-arrow-rust)" />
          <text x="100" y="-60" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="var(--color-rust)">SS 304 · 1.2 mm · #4</text>
          {/* dim bottom */}
          <line x1="0" y1="34" x2="260" y2="34" markerStart="url(#sv-arrow)" markerEnd="url(#sv-arrow)" />
          <line x1="0" y1="28" x2="0" y2="40" />
          <line x1="260" y1="28" x2="260" y2="40" />
          <text x="130" y="50" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="currentColor">A — A · 260</text>
        </g>

        {/* === Bullnose radius detail (middle-left, small circle with R6 callout) === */}
        <g transform="translate(140,640)" stroke="currentColor" fill="none" strokeWidth="1">
          <circle cx="40" cy="40" r="30" />
          {/* radius indicator */}
          <line x1="40" y1="40" x2="61" y2="19" markerEnd="url(#sv-arrow)" />
          <text x="70" y="22" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="currentColor">R 6</text>
          {/* leader to detail tag */}
          <line x1="70" y1="60" x2="200" y2="100" />
          <circle cx="200" cy="100" r="14" />
          <text x="200" y="104" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="currentColor">D2</text>
        </g>

        {/* === Pendant elevation (top-right, simple lamp + drop) === */}
        <g transform="translate(1280,60)" stroke="currentColor" fill="none" strokeWidth="1">
          {/* drop wire */}
          <line x1="50" y1="0" x2="50" y2="80" />
          {/* shade */}
          <path d="M20,80 L80,80 L70,110 L30,110 Z" />
          {/* bulb dim */}
          <line x1="20" y1="80" x2="-10" y2="80" markerEnd="url(#sv-arrow)" />
          <text x="-14" y="84" textAnchor="end" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="currentColor">Ø60</text>
          {/* drop height */}
          <line x1="120" y1="0" x2="120" y2="110" markerStart="url(#sv-arrow)" markerEnd="url(#sv-arrow)" />
          <text x="130" y="60" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="currentColor">1100</text>
        </g>

        {/* === Weld symbol (middle, anchored at the heart of the canvas) === */}
        <g transform="translate(700,440)" stroke="currentColor" fill="none" strokeWidth="1">
          <line x1="0" y1="0" x2="160" y2="0" />
          <polygon points="160,-10 178,0 160,10" fill="currentColor" />
          <line x1="60" y1="0" x2="80" y2="-20" />
          <line x1="80" y1="-20" x2="100" y2="0" />
          <text x="62" y="-26" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="currentColor">TIG · Ø3</text>
        </g>

        {/* === Centerlines + crosshairs scattered === */}
        <g stroke="currentColor" fill="none" strokeWidth="0.8" opacity="0.55">
          <line x1="540" y1="120" x2="540" y2="200" strokeDasharray="14 2 2 2" />
          <line x1="500" y1="160" x2="580" y2="160" strokeDasharray="14 2 2 2" />
          <circle cx="540" cy="160" r="3" />

          <line x1="980" y1="300" x2="980" y2="380" strokeDasharray="14 2 2 2" />
          <line x1="940" y1="340" x2="1020" y2="340" strokeDasharray="14 2 2 2" />
          <circle cx="980" cy="340" r="3" />

          <line x1="240" y1="430" x2="240" y2="510" strokeDasharray="14 2 2 2" />
          <line x1="200" y1="470" x2="280" y2="470" strokeDasharray="14 2 2 2" />
          <circle cx="240" cy="470" r="3" />
        </g>

        {/* === Drift band — long horizontal dimension across the upper third === */}
        <g transform="translate(420,300)" stroke="currentColor" fill="none" strokeWidth="0.8" opacity="0.5">
          <line x1="0" y1="0" x2="760" y2="0" markerStart="url(#sv-arrow)" markerEnd="url(#sv-arrow)" />
          <line x1="0" y1="-6" x2="0" y2="6" />
          <line x1="760" y1="-6" x2="760" y2="6" />
          <text x="380" y="-8" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="currentColor">12 stations · 24 m run</text>
        </g>
      </svg>
    </div>
  );
}
