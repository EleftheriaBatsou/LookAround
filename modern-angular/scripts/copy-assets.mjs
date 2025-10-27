import { mkdirSync, existsSync, cpSync } from 'fs';
import { resolve } from 'path';

const srcImg = resolve(process.cwd(), '../app/img');
const destImg = resolve(process.cwd(), 'public/img');

if (!existsSync(destImg)) {
  mkdirSync(destImg, { recursive: true });
}

try {
  cpSync(srcImg, destImg, { recursive: true });
  console.log('Copied assets from', srcImg, 'to', destImg);
} catch (e) {
  console.warn('Asset copy failed:', e?.message || e);
}