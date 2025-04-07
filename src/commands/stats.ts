import fs from 'node:fs/promises';
import path from 'node:path';
import { logger } from '../util/constants.js';
import { getMarkdownFiles, getVaultPath } from '../util/helpers.js';

/*
 * Gets statistics of the vault.
 */
export default async function getStats() {
  logger.info(`Getting the statistics of your vault.`);

  const vaultPath = await getVaultPath();
  const files = await getMarkdownFiles(vaultPath);

  if (files.length === 0) {
    logger.info('No markdown files found in the vault...');
    return;
  }

  let totalWords = 0;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const wordCount = content.trim().split(/\s+/).length;
    totalWords += wordCount;
  }

  const folderSet = new Set(files.map((folder) => path.relative(vaultPath, path.dirname(folder))));

  console.log(`📄 Total notes: ${files.length}`);
  console.log(`📂 Folders: ${folderSet.size}`);
  console.log(`📝 Average words per note: ${(totalWords / files.length).toFixed(1)}`);
}
