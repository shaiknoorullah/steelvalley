/**
 * sv-process-videos.mjs
 * Re-encodes all WhatsApp videos for web with -movflags +faststart so they
 * stream from the first byte. Generates a poster JPG for each clip.
 *
 * Output: public/video/
 *   - sv-clip-NN.mp4   (H.264 + AAC, web-faststart, CRF 28)
 *   - sv-clip-NN.jpg   (poster from first frame)
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const exec = promisify(execFile);

const SRC_DIR = 'C:/Users/moham/OneDrive/Desktop/NoorGithub/SV Assets';
const OUT_DIR = path.resolve('public/video');

async function ensureDir(d) { if (!existsSync(d)) await mkdir(d, { recursive: true }); }
async function size(p) { return ((await stat(p)).size / 1024 / 1024).toFixed(2) + ' MB'; }

async function main() {
  await ensureDir(OUT_DIR);
  const files = (await readdir(SRC_DIR)).filter(f => /\.mp4$/i.test(f)).sort();
  console.log(`Found ${files.length} videos.`);

  let i = 1;
  for (const f of files) {
    const src = path.join(SRC_DIR, f);
    const tag = String(i).padStart(2, '0');
    const outVid = path.join(OUT_DIR, `sv-clip-${tag}.mp4`);
    const outPoster = path.join(OUT_DIR, `sv-clip-${tag}.jpg`);
    const before = await size(src);

    // H.264 CRF 28 (good web quality), AAC 96k, scale max to 1080p height keeping AR,
    // faststart for byte-range streaming.
    await exec('ffmpeg', [
      '-y', '-i', src,
      '-vf', "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '28',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '96k',
      '-movflags', '+faststart',
      outVid,
    ]);

    // Poster: frame at 1 second, 80% quality JPG, max width 1280
    await exec('ffmpeg', [
      '-y', '-ss', '1', '-i', src,
      '-frames:v', '1',
      '-vf', "scale='min(1280,iw)':-2",
      '-q:v', '5',
      outPoster,
    ]);

    const after = await size(outVid);
    console.log(`  ${f}  ->  sv-clip-${tag}  (${before} -> ${after})`);
    i++;
  }
  console.log('Video processing complete.');
}

main().catch(e => { console.error(e); process.exit(1); });
