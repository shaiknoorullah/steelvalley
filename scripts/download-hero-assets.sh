#!/usr/bin/env bash
#
# download-hero-assets.sh — fetches the v3 hero CC0 assets and downsamples
# textures to the right tier (per docs/superpowers/specs/2026-05-18-hero-v3-…).
#
# Idempotent: skips any file that's already present.
# Required tools: curl, unzip, magick (ImageMagick 7) or convert (IM6).
#
# Sources (all CC0, no attribution required):
#   - PolyHaven HDRIs:  https://polyhaven.com
#   - AmbientCG textures: https://ambientcg.com
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_DIR="$ROOT/public/3d/env"
TEX_DIR="$ROOT/public/tex"
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

mkdir -p "$ENV_DIR" "$TEX_DIR/steel" "$TEX_DIR/concrete" "$TEX_DIR/tile" "$TEX_DIR/plaster"

# ── Cross-platform "magick" wrapper (IM 7 prefers `magick convert`, IM 6 uses `convert`) ──
if command -v magick &>/dev/null; then
  IM() { magick "$@"; }
else
  IM() { convert "$@"; }
fi

# ── Helper: download once ──
dl() {
  local url="$1" out="$2"
  if [ -s "$out" ]; then echo "skip $out ($(du -h "$out" | cut -f1))"; return; fi
  echo "→ $url"
  curl -fsSL "$url" -o "$out"
  echo "  ok $out ($(du -h "$out" | cut -f1))"
}

# ── Helper: extract+rename+downscale a PBR set from an AmbientCG zip ──
#   args: zip_url out_dir target_size quality
#   produces basecolor.jpg normal.jpg roughness.jpg metalness.jpg (metalness optional)
acg_fetch() {
  local zip_url="$1" out_dir="$2" tgt_size="$3" quality="$4"
  local sentinel="$out_dir/basecolor.jpg"
  if [ -s "$sentinel" ]; then echo "skip $out_dir (already present)"; return; fi
  local zip="$TMP_DIR/$(basename "$out_dir").zip"
  echo "→ AmbientCG: $(basename "$zip_url")"
  curl -fsSL "$zip_url" -o "$zip"

  # Unpack only the maps we care about
  unzip -j -o "$zip" "*Color*" "*Normal*GL*" "*Roughness*" "*Metalness*" \
    -d "$out_dir" 2>&1 | grep -E "inflating|extracting" || true

  # Normalize names + downscale + recompress
  cd "$out_dir"
  for f in *_Color.* *Color.*; do [ -e "$f" ] || continue
    IM "$f" -resize "${tgt_size}x${tgt_size}>" -strip -quality "$quality" basecolor.jpg
    rm -f "$f"; break
  done
  for f in *_NormalGL.* *NormalGL.*; do [ -e "$f" ] || continue
    IM "$f" -resize "${tgt_size}x${tgt_size}>" -strip -quality "$quality" normal.jpg
    rm -f "$f"; break
  done
  for f in *_Roughness.* *Roughness.*; do [ -e "$f" ] || continue
    IM "$f" -colorspace Gray -resize "${tgt_size}x${tgt_size}>" -strip -quality "$quality" roughness.jpg
    rm -f "$f"; break
  done
  for f in *_Metalness.* *Metalness.*; do [ -e "$f" ] || continue
    IM "$f" -colorspace Gray -resize "${tgt_size}x${tgt_size}>" -strip -quality "$quality" metalness.jpg
    rm -f "$f"; break
  done
  # Clean any leftover original-named files
  rm -f *_*.png *_*.jpg 2>/dev/null || true
  cd - >/dev/null
}

echo "=== Phase A.1: HDR environment (PolyHaven kiara_interior, 1K) ==="
# 1K HDR (~1.7MB) is plenty for IBL reflections; 2K (~6.5MB) wasn't a 4x win.
dl "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kiara_interior_1k.hdr" \
   "$ENV_DIR/kiara_interior_1k.hdr"

echo ""
echo "=== Phase A.2: Brushed steel (AmbientCG Metal046A) — HERO tier 1024px q85 ==="
acg_fetch "https://ambientcg.com/get?file=Metal046A_1K-JPG.zip" \
          "$TEX_DIR/steel" 1024 85

echo ""
echo "=== Phase A.3: Polished concrete floor (AmbientCG Concrete033) — FAR tier 512px q75 ==="
acg_fetch "https://ambientcg.com/get?file=Concrete033_1K-JPG.zip" \
          "$TEX_DIR/concrete" 512 75

echo ""
echo "=== Phase A.4: Subway tile back wall (AmbientCG Tiles040) — MID tier 512px q80 ==="
acg_fetch "https://ambientcg.com/get?file=Tiles040_1K-JPG.zip" \
          "$TEX_DIR/tile" 512 80

echo ""
echo "=== Phase A.5: Plaster side wall (AmbientCG Plaster001) — FAR tier 512px q75 ==="
acg_fetch "https://ambientcg.com/get?file=Plaster001_1K-JPG.zip" \
          "$TEX_DIR/plaster" 512 75

echo ""
echo "=== Phase A complete — totals ==="
du -sh "$ENV_DIR" "$TEX_DIR"/* 2>/dev/null | column -t
echo ""
ls -la "$TEX_DIR/steel" "$TEX_DIR/concrete" "$TEX_DIR/tile" "$TEX_DIR/plaster" | grep -v '^total'
