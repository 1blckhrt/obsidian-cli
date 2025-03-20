import { promises as fs } from 'node:fs'
import { CONFIG_DIR, CONFIG_PATH, type CONFIG_TEMPLATE } from './constants.js'

export async function checkConfigFile(): Promise<CONFIG_TEMPLATE> {
  try {
    return await readConfigFile()
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return createDefaultConfig()
    }

    throw error
  }
}

export async function readConfigFile(): Promise<CONFIG_TEMPLATE> {
  const configContent = await fs.readFile(CONFIG_PATH, 'utf8')
  console.log('Config file read successfully.')
  return JSON.parse(configContent)
}

export async function createDefaultConfig(): Promise<CONFIG_TEMPLATE> {
  const defaultConfig: CONFIG_TEMPLATE = { vaultPath: '~/Obsidian' }
  await fs.mkdir(CONFIG_DIR, { recursive: true })
  await fs.writeFile(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2))
  console.log('Config template generated successfully.')
  return defaultConfig
}

export async function getVaultPath(): Promise<string> {
  const config = await checkConfigFile()
  return config.vaultPath
}
