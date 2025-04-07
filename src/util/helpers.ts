import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  CONFIG_DIR,
  CONFIG_PATH,
  LOG_DIR,
  LOG_PATH,
  logger,
  type CONFIG_TEMPLATE,
} from './constants.js';

/**
 * Creates a directory.
 *
 * @param path - The path to the directory you want to create.
 */
export async function createDirectory(path: string) {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (error: any) {
    if (error.code === 'EEXIST') {
      logger.info(`Directory already exists at ${path}`);
    } else {
      logger.info(`Error creating directory at ${path}:`, error);
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
    if (error.code === 'EEXIST') {
      logger.info(`File already exists at ${path}`);
    } else {
      logger.error(`Error creating file at ${path}:`, error);
    }
  }
}

/**
 * Creates the default configuration file.
 */
export async function createDefaultConfig() {
  const defaultConfig: CONFIG_TEMPLATE = { vaultPath: '~/Obsidian' };
  await fs.writeFile(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
  return defaultConfig;
}

/*
 * Checks the configuration directory for the configuration file.
 */
export async function checkConfigFile() {
  try {
    const config = await fs.readFile(CONFIG_PATH, 'utf8');

    if (!config.trim()) {
      logger.info(`Config file is empty at ${CONFIG_PATH}. Creating a new one...`);
      return await createDefaultConfig();
    }

    return JSON.parse(config);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      logger.info(`Config file not found at ${CONFIG_PATH}. Creating a new one...`);
    } else {
      logger.error(`Error reading config file at ${CONFIG_PATH}:`, error);
    }

    return createDefaultConfig();
  }
}

/**
 * Grabs all of the files in the directory specified and returns them for usage
 *
 * @param dir - The directory to grab files from
 */
export async function getMarkdownFiles(dir: string): Promise<string[]> {
  let results: string[] = [];
  const files = fs.readdir(dir);

  for (const file of await files) {
    const filePath = path.join(dir, file);
    const stat = fs.stat(filePath);

    if ((await stat).isDirectory()) {
      results = results.concat(await getMarkdownFiles(filePath));
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  }

  return results;
}

/*
 * Gets the vault path from the configuration file.
 */
export async function getVaultPath() {
  return (await checkConfigFile()).vaultPath;
}

/*
 * Creates all configuration and log files.
 */
export async function createAllFiles() {
  await createDirectory(CONFIG_DIR);
  await createDirectory(LOG_DIR);
  await createFile(CONFIG_PATH);
  await createFile(LOG_PATH);
}
