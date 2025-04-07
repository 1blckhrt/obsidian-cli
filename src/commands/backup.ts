import { promises as fs } from 'node:fs';
import { logger } from '../util/constants.js';
import { getVaultPath } from '../util/helpers.js';

/**
 * Performs a backup to a specified directory.
 *
 * @param backupPath - The path to the backup directory.
 */
export default async function backupVault(backupPath: string) {
  logger.info(`Backing up vault to ${backupPath}`);

  try {
    await fs.access(backupPath);
  } catch {
    logger.info('Backup directory not found, creating...');
    await fs.mkdir(backupPath, { recursive: true });
    logger.info('Backup directory created!');
  }

  try {
    const vaultPath = await getVaultPath();
    await fs.cp(vaultPath, backupPath, { recursive: true });
    logger.info('The backup was successful!');
  } catch (error) {
    console.error('Failed to backup vault!', error);
  }
}
