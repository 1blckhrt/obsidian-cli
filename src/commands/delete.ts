import fs from 'node:fs/promises';
import path from 'node:path';
import { select } from '@inquirer/prompts';
import Fuse from 'fuse.js';
import { logger } from '../util/constants.js';
import { getMarkdownFiles, getVaultPath } from '../util/helpers.js';

/**
 * Deletes a note based on a provided query.
 *
 * @param query - The phrase to search for across file names.
 */
export default async function deleteNote(query: string) {
  const directory = path.resolve(await getVaultPath());
  const files = await getMarkdownFiles(directory);

  logger.info(`Found ${files.length} markdown files.`);

  const fileData = await Promise.all(
    files.map(async (file) => {
      return { title: path.basename(file), path: file };
    })
  );

  const fuse = new Fuse(fileData, {
    keys: ['title'],
    threshold: 0.2,
    includeMatches: true,
    ignoreLocation: true,
    useExtendedSearch: true,
  });

  const results = fuse.search(query);

  logger.info(`Found ${results.length} results matching the query.`);

  if (results.length === 0) {
    logger.info('No matching files found.');
    return;
  }

  const selectedFile = await select({
    message: 'Select a file to delete:',
    choices: results.map((result) => ({
      title: result.item.title,
      value: result.item.path,
    })),
  });

  try {
    await fs.unlink(selectedFile);
    logger.info(`File deleted: ${selectedFile}`);
  } catch (error) {
    console.error(`Failed to delete file: ${selectedFile}`, error);
  }
}
