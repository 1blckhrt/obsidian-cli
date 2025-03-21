import * as os from 'node:os'
import { createLogger, format, transports } from 'winston'

export const CONFIG_FILE = 'config.json'
export const CONFIG_DIR = `${os.homedir()}/.config/obsidian-cli`
export const CONFIG_PATH = `${CONFIG_DIR}/${CONFIG_FILE}`

export const LOG_FILE = 'obsidian-cli.log'
export const LOG_DIR = `${os.homedir()}/.local/share/obsidian-cli/logs`
export const LOG_PATH = `${LOG_DIR}/${LOG_FILE}`

export type CONFIG_TEMPLATE = {
  vaultPath: string
}

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.printf(({ level, message }) => {
      return `[${level}]: ${message}`
    })
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),

    new transports.File({
      filename: LOG_PATH,
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp} ${level}]: ${message}`
        })
      ),
    }),
  ],
})
