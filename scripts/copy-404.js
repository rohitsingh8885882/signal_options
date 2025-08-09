import { copyFile, constants } from 'node:fs';
import { resolve } from 'node:path';

const src = resolve('dist', 'index.html');
const dest = resolve('dist', '404.html');

copyFile(src, dest, constants.COPYFILE_FICLONE, (err) => {
  if (err) {
    console.error('Failed to copy 404.html:', err);
    process.exit(1);
  } else {
    console.log('Created dist/404.html for GitHub Pages SPA routing');
  }
});


