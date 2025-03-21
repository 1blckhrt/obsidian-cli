import process from 'node:process'
import { program } from 'commander'
import { commands } from './commands/index.js'
import { logger } from './util/constants.js'
import { createAllFiles, checkConfigFile } from './util/helpers.js'

async function initialize() {
  try {
    await createAllFiles()
    await checkConfigFile()
    logger.info('Configuration file loaded successfully.')
  } catch (error) {
    logger.error('Error initializing the application:', error)
  }
}

await initialize()

program.name('obsidian-cli').description('CLI tool for managing Obsidian vaults').version('1.0.0')

program
  .command('list')
  .description('Lists all files in your vault.')
  .action(() => {
    commands.listFiles()
  })

program
  .command('delete')
  .description('Delete a specific note in your vault.')
  .argument('<title>', 'Title of the note you want to delete.')
  .action((title) => {
    commands.deleteFile(title)
  })

program
  .command('search')
  .description('Search for a specific phrase in your Vault.')
  .argument('<phrase>', 'Phrase that you want to search for')
  .action((phrase) => {
    commands.searchFiles(phrase)
  })

program
  .command('create')
  .description('Create a note with a specific title.')
  .argument('<title>', 'Title of the note')
  .action((title) => {
    commands.createFile(title)
  })

program
  .command('backup')
  .description('Backup your vault to a specified directory')
  .argument('<backupPath>', 'Path to the backup location')
  .action((backupPath) => {
    commands.backupVault(backupPath)
  })

program
  .command('stats')
  .description('Displays statistics about your vault and its notes.')
  .action(() => {
    commands.getStats()
  })

program.parse(process.argv)
