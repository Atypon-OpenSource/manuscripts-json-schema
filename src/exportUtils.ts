import { existsSync, readFile, writeFile, mkdir } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const writeFilePromise = promisify(writeFile);
const readFilePromise = promisify(readFile);
const mkdirPromise = promisify(mkdir);

export type Directory = 'es' | 'cjs' | 'types';

export async function appendToDistFile(
  filename: string,
  directory: Directory,
  contents: string
) {
  const DIST_DIR = 'dist';

  if (!existsSync(DIST_DIR)) {
    await mkdirPromise(DIST_DIR);
  }

  const folderPath = join(DIST_DIR, directory);

  if (!existsSync(folderPath)) {
    await mkdirPromise(folderPath);
  }

  const path = join(folderPath, filename);

  if (existsSync(path)) {
    const existingContents = await readFilePromise(path, 'utf8');
    contents = [existingContents, contents].join('\n');
  }

  await writeFilePromise(path, contents, 'utf8');
}
