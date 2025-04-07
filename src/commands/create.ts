import { writeFile } from 'node:fs/promises';
import { dirname, join, normalize } from 'node:path';
import { editor } from '@inquirer/prompts';
import { logger } from '../util/constants.js';
import { createDirectory, getVaultPath } from '../util/helpers.js';

export default async function createNote(title: string) {
  console.log(`Creating note with the title ${title}`);

  const fileName = title.replace(/\.md$/, '').replaceAll(/\s+/g, '_') + '.md';

  const vaultPath = await getVaultPath();

  const filePath = normalize(join(vaultPath, fileName));

  if (!filePath.startsWith(vaultPath)) {
    logger.error('Invalid path: trying to write outside the vault.');
    return;
  }

  const dirPath = dirname(filePath);
  await createDirectory(dirPath);

  const content = await editor({
    message: 'Edit the file content:',
    default: '',
  });

  try {
    await writeFile(filePath, content, 'utf8');
    console.log(`File saved: ${filePath}`);
  } catch (error) {
    console.error(`Failed to save file: ${filePath}`, error);
  }
}
