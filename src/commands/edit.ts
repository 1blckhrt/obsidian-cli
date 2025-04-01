import fs from 'node:fs/promises';
import path from 'node:path';
import { editor, select } from '@inquirer/prompts';
import fastGlob from 'fast-glob';
import Fuse from 'fuse.js';
import { getVaultPath } from '../util/helpers.js';

export default async function editNote(query: string) {
  const directory = path.resolve(await getVaultPath());
  const files = await fastGlob(`${directory}/**/*.md`);

  console.log(`Found ${files.length} markdown files.`);

  const fileData = await Promise.all(
    files.map(async (file) => {
      let content = '';
      try {
        content = await fs.readFile(file, 'utf8');
      } catch (error) {
        console.warn(`Could not read file: ${file}`, error);
      }

      return { title: path.basename(file), content, path: file };
    })
  );

  const fuse = new Fuse(fileData, {
    keys: ['title', 'content'],
    threshold: 0.2,
    includeMatches: true,
    ignoreLocation: true,
    useExtendedSearch: true,
  });

  const results = fuse.search(query);

  console.log(`Found ${results.length} results matching the query.`);

  if (results.length === 0) {
    console.log('No matching files found.');
    return;
  }

  const selectedFile = await select({
    message: 'Select a file to edit:',
    choices: results.map((result) => ({
      title: result.item.title,
      value: result.item.path,
    })),
  });

  let fileContent = '';
  try {
    fileContent = await fs.readFile(selectedFile, 'utf8');
  } catch {
    console.error(`Could not read file: ${selectedFile}`);
    return;
  }

  const content = await editor({
    message: 'Edit the file content:',
    default: fileContent,
  });

  try {
    await fs.writeFile(selectedFile, content, 'utf8');
    console.log(`File saved: ${selectedFile}`);
  } catch (error) {
    console.error(`Failed to save file: ${selectedFile}`, error);
  }
}
