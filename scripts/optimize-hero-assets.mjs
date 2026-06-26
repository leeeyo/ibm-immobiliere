import sharp from "sharp";
import { readdir, unlink, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const dir = new URL("../public/hero/", import.meta.url).pathname.replace(/^\//, "");
const files = (await readdir(dir)).filter((f) => f.endsWith(".png"));

for (const f of files) {
  const inPath = join(dir, f);
  const { name } = parse(f);
  const outPath = join(dir, `${name}.jpg`);
  await sharp(inPath)
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(outPath);
  const before = (await stat(inPath)).size;
  const after = (await stat(outPath)).size;
  await unlink(inPath);
  console.log(`${f}: ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(2)}MB`);
}
