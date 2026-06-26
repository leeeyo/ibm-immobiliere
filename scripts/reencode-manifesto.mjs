/**
 * Re-encode public/hero/manifesto-3d.mp4 for smooth scroll-scrubbing:
 *  - All frames are keyframes (-g 1 -bf 0 -keyint_min 1 -sc_threshold 0)
 *    so video.currentTime seeking is O(1) per frame.
 *  - colorlevels filter clips the light-gray studio bg toward white.
 *  - faststart so the moov atom sits at the head of the file (fast seek).
 */
import { spawn } from "node:child_process";
import { rename, stat, unlink } from "node:fs/promises";
import ffmpegPath from "ffmpeg-static";

const src = "public/hero/manifesto-3d.mp4";
const tmp = "public/hero/manifesto-3d.scrub.mp4";

// Push the gray studio bg toward white: input 0..0.78 maps to output 0..1,
// values above 0.78 (~200/255) clip to white. Subject darker than that is preserved.
// `eq=brightness=0.02` lifts midtones a hair to bring near-white floor reflections to white.
const vfilter = [
  "colorlevels=rimin=0.0:gimin=0.0:bimin=0.0:rimax=0.78:gimax=0.78:bimax=0.78",
  "eq=brightness=0.01:contrast=1.02",
].join(",");

const args = [
  "-y",
  "-i", src,
  "-vf", vfilter,
  "-c:v", "libx264",
  "-preset", "slow",
  "-crf", "20",
  "-pix_fmt", "yuv420p",
  // every frame an I-frame → instant seek
  "-g", "1",
  "-keyint_min", "1",
  "-sc_threshold", "0",
  "-bf", "0",
  // metadata at head
  "-movflags", "+faststart",
  "-an",
  tmp,
];

console.log("ffmpeg:", ffmpegPath);
console.log("args:", args.join(" "));

await new Promise((resolve, reject) => {
  const p = spawn(ffmpegPath, args, { stdio: ["ignore", "inherit", "inherit"] });
  p.on("error", reject);
  p.on("close", (code) => (code === 0 ? resolve() : reject(new Error("ffmpeg exit " + code))));
});

const before = (await stat(src)).size;
const after = (await stat(tmp)).size;
await unlink(src);
await rename(tmp, src);
console.log(`manifesto-3d.mp4: ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB`);
