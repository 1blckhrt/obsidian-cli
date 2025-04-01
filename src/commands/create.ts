import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { editor } from '@inquirer/prompts';
import { getVaultPath } from '../util/helpers.js';

export default async function createNote(title: string) {
  console.log(`Creating note with the title ${title}`);

  let fileName = title.replace('.md', '');
  fileName = `${title.replaceAll(/\s+/g, '_')}.md`;

  const vaultPath = await getVaultPath();

  const filePath = join(vaultPath, fileName);

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
