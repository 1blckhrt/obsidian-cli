import { promises as fs } from 'node:fs'
import { CONFIG_DIR, CONFIG_PATH, LOG_DIR, LOG_PATH, type CONFIG_TEMPLATE } from './constants.js'

async function createDirectory(path: string) {
  try {
    await fs.mkdir(path, { recursive: true })
  } catch (error: any) {
    if (error.code === 'EEXIST') {
      console.error(`Directory already exists at ${path}`)
    } else {
      console.error(`Error creating directory at ${path}:`, error)
    }
  }
}

async function createFile(path: string) {
  try {
    await fs.writeFile(path, '', { flag: 'wx' })
  } catch (error: any) {
    if (error.code === 'EEXIST') {
      console.error(`File already exists at ${path}`)
    } else {
      console.error(`Error creating file at ${path}:`, error)
    }
  }
}

async function readConfigFile() {
  try {
    return JSON.parse(await fs.readFile(CONFIG_PATH, 'utf8'))
  } catch (error) {
    console.error(`Error reading config file at ${CONFIG_PATH}:`, error)
    throw error
  }
}

async function createDefaultConfig() {
  const defaultConfig: CONFIG_TEMPLATE = { vaultPath: '~/Obsidian' }
  await fs.writeFile(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2))
  return defaultConfig
}

export async function checkConfigFile() {
  try {
    return await readConfigFile()
  } catch {
    console.error(`Config file not found at ${CONFIG_PATH}. Creating a new one...`)
    return createDefaultConfig()
  }
}

export async function getVaultPath() {
  return (await checkConfigFile()).vaultPath
}

export async function createAllFiles() {
  await createDirectory(CONFIG_DIR)
  await createDirectory(LOG_DIR)
  await createFile(CONFIG_PATH)
  await createFile(LOG_PATH)
}
