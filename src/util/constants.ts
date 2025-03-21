import * as os from 'node:os'

export const CONFIG_FILE = 'config.json'
export const CONFIG_DIR = `${os.homedir()}/.config/obsidian-cli`
export const CONFIG_PATH = `${CONFIG_DIR}/${CONFIG_FILE}`

export const LOG_FILE = 'obsidian-cli.log'
export const LOG_DIR = `${os.homedir()}/.local/share/obsidian-cli/logs`
export const LOG_PATH = `${LOG_DIR}/${LOG_FILE}`

export type CONFIG_TEMPLATE = {
  vaultPath: string
}
