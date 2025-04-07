import { promises as fs } from 'node:fs';
import { getVaultPath } from '../util/helpers.js';

/**
 * Performs a backup to a specified directory.
 *
 * @param backupPath - The path to the backup directory.
 */
export default async function backupVault(backupPath: string) {
  console.log(`Backing up vault to ${backupPath}`);

  try {
    await fs.access(backupPath);
    console.log('Found backup directory!');
  } catch {
    console.log('Backup directory not found, creating...');
    await fs.mkdir(backupPath, { recursive: true });
    console.log('Backup directory created!');
  }

  try {
    const vaultPath = await getVaultPath();
    await fs.cp(vaultPath, backupPath, { recursive: true });
    console.log('The backup was successful!');
  } catch (error) {
    console.error('Failed to backup vault!', error);
  }
}
