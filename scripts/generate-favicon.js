/**
 * Builds app/favicon.ico from the upscaled black IBM logo (multi-size ICO).
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const toIco = require("to-ico");

const ROOT = path.join(__dirname, "..");
const INPUT = path.join(ROOT, "public", "IBM_logo_black_transparent.png");
const OUTPUT = path.join(ROOT, "app", "favicon.ico");
const SIZES = [16, 32, 48];
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

async function main() {
  const buffers = await Promise.all(
    SIZES.map((size) =>
      sharp(INPUT)
        .resize(size, size, {
          fit: "contain",
          background: WHITE,
        })
        .flatten({ background: WHITE })
        .sharpen()
        .png()
        .toBuffer()
    )
  );
  const ico = await toIco(buffers);
  fs.writeFileSync(OUTPUT, ico);
  console.log("Wrote", path.relative(ROOT, OUTPUT));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
