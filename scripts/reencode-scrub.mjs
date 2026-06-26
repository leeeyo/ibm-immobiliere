/**
 * Re-encode a video for smooth scroll-scrubbing.
 *  - All frames are keyframes so video.currentTime seeking is O(1) per frame.
 *  - colorlevels filter clips the light-gray studio bg toward white so the
 *    multiply blend in the page punches the bg through to the section color.
 *  - faststart so the moov atom sits at the head of the file (fast seek).
 *
 * Usage: node scripts/reencode-scrub.mjs <input.mp4> [<input2.mp4> ...]
 * Each file is re-encoded in place.
 */
import { spawn } from "node:child_process";
import { rename, stat, unlink } from "node:fs/promises";
import { dirname, basename, join } from "node:path";
import ffmpegPath from "ffmpeg-static";

const inputs = process.argv.slice(2);
if (inputs.length === 0) {
  console.error("Usage: node scripts/reencode-scrub.mjs <input.mp4> [<input2.mp4> ...]");
  process.exit(1);
}

const vfilter = [
  "colorlevels=rimin=0.0:gimin=0.0:bimin=0.0:rimax=0.78:gimax=0.78:bimax=0.78",
  "eq=brightness=0.01:contrast=1.02",
].join(",");

for (const src of inputs) {
  const tmp = join(dirname(src), basename(src, ".mp4") + ".scrub.mp4");
  const args = [
    "-y",
    "-i", src,
    "-vf", vfilter,
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "20",
    "-pix_fmt", "yuv420p",
    "-g", "1",
    "-keyint_min", "1",
    "-sc_threshold", "0",
    "-bf", "0",
    "-movflags", "+faststart",
    "-an",
    tmp,
  ];

  console.log(`\n=== ${src} ===`);
  console.log("ffmpeg:", ffmpegPath);

  await new Promise((resolve, reject) => {
    const p = spawn(ffmpegPath, args, { stdio: ["ignore", "inherit", "inherit"] });
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error("ffmpeg exit " + code))));
  });

  const before = (await stat(src)).size;
  const after = (await stat(tmp)).size;
  await unlink(src);
  await rename(tmp, src);
  console.log(`${src}: ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB`);
}
