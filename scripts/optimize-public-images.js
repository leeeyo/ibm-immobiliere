/**
 * Losslessly resizes oversized public images and recompresses them in place.
 * Dry-run is the default. Pass --write to replace files only when smaller.
 */
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..", "public");
const WRITE = process.argv.includes("--write");
const maxWidthArg = process.argv.find((arg) => arg.startsWith("--max-width="));
const minKbArg = process.argv.find((arg) => arg.startsWith("--min-kb="));
const MAX_WIDTH = Number(maxWidthArg?.split("=")[1] || 2560);
const MIN_BYTES = Number(minKbArg?.split("=")[1] || 500) * 1024;
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(fullPath) : [fullPath];
    })
  );
  return nested.flat();
}

function formatPipeline(pipeline, extension) {
  if (extension === ".png") return pipeline.png({ compressionLevel: 9, effort: 10 });
  if (extension === ".webp") return pipeline.webp({ quality: 82, alphaQuality: 90, effort: 6 });
  return pipeline.jpeg({ quality: 82, mozjpeg: true });
}

function humanSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function optimize(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (!EXTENSIONS.has(extension)) return null;

  const stat = await fs.stat(filePath);
  if (stat.size < MIN_BYTES) return null;

  const source = sharp(filePath, { failOn: "warning" }).rotate();
  const metadata = await source.metadata();
  const pipeline = metadata.width && metadata.width > MAX_WIDTH
    ? source.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    : source;
  const output = await formatPipeline(pipeline, extension).toBuffer();
  if (output.length >= stat.size) return null;

  if (WRITE) {
    const temporary = `${filePath}.optimized`;
    await fs.writeFile(temporary, output);
    await fs.rename(temporary, filePath);
  }

  return {
    file: path.relative(ROOT, filePath),
    before: stat.size,
    after: output.length,
  };
}

async function main() {
  if (!Number.isFinite(MAX_WIDTH) || MAX_WIDTH < 320) throw new Error("Invalid --max-width value");
  if (!Number.isFinite(MIN_BYTES) || MIN_BYTES < 0) throw new Error("Invalid --min-kb value");

  const files = await walk(ROOT);
  const results = [];
  for (const file of files) {
    const result = await optimize(file);
    if (result) results.push(result);
  }

  let before = 0;
  let after = 0;
  for (const result of results) {
    before += result.before;
    after += result.after;
    console.log(`${WRITE ? "Optimized" : "Would optimize"} ${result.file}: ${humanSize(result.before)} -> ${humanSize(result.after)}`);
  }

  console.log(`${WRITE ? "Saved" : "Potential saving"}: ${humanSize(before - after)} across ${results.length} image(s).`);
  if (!WRITE) console.log("Run npm run images:optimize:write to apply these changes.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
