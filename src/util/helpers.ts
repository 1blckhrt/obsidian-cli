import { promises as fs } from 'node:fs';
import path from 'node:path';
import { CONFIG_DIR, CONFIG_PATH, LOG_DIR, LOG_PATH, type CONFIG_TEMPLATE } from './constants.js';

/**
 * Creates a directory.
 *
 * @param path - The path to the directory you want to create.
 */
export async function createDirectory(path: string) {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      console.error(`Error creating directory at ${path}:`, error);
    }
  }
}

/**
 * Creates a file.
 *
 * @param path - The path to the file you want to create.
 */
export async function createFile(path: string) {
  try {
    await fs.writeFile(path, '', { flag: 'wx' });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      console.error(`Error creating file at ${path}:`, error);
    }
  }
}

/**
 * Creates the default configuration file.
 */
export async function createDefaultConfig() {
  const defaultConfig: CONFIG_TEMPLATE = { vaultPath: '~/Obsidian' };
  try {
    await fs.writeFile(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
  } catch (error: any) {
    console.error(`Error creating default config at ${CONFIG_PATH}:`, error);
  }

  return defaultConfig;
}

/**
 * Checks the configuration directory for the configuration file.
 */
export async function checkConfigFile() {
  try {
    const config = await fs.readFile(CONFIG_PATH, 'utf8');

    if (!config.trim()) {
      return await createDefaultConfig();
    }

    return JSON.parse(config);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await createDefaultConfig();
    } else {
      console.error(`Error reading config file at ${CONFIG_PATH}:`, error);
    }

    return createDefaultConfig();
  }
}

/**
 * Grabs all of the files in the directory specified and returns them for usage.
 *
 * @param dir - The directory to grab files from
 */
export async function getMarkdownFiles(dir: string): Promise<string[]> {
  let results: string[] = [];
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        results = results.concat(await getMarkdownFiles(filePath));
      } else if (file.endsWith('.md')) {
        results.push(filePath);
      }
    }
  } catch (error: any) {
    console.error(`Error reading files from directory ${dir}:`, error);
  }

  return results;
}

/**
 * Gets the vault path from the configuration file.
 */
export async function getVaultPath() {
  return (await checkConfigFile()).vaultPath;
}

/**
 * Creates all configuration and log files.
 */
export async function createAllFiles() {
  await createDirectory(CONFIG_DIR);
  await createDirectory(LOG_DIR);
  await createFile(CONFIG_PATH);
  await createFile(LOG_PATH);
}
