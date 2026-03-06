import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

async function main() {
  const [, , inputPath, outputPath] = process.argv;

  if (!inputPath || !outputPath) {
    throw new Error('Usage: node optimize-upload.mjs <input> <output>');
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  await sharp(inputPath)
    .rotate()
    .resize({ width: 1024, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
