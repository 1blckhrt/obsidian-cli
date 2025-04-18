import process from 'node:process';
import { program } from 'commander';
import { commands } from './commands/index.js';
import { logger } from './util/constants.js';
import { checkConfigFile, createAllFiles } from './util/helpers.js';

/*
 * Initializes the configuration files.
 */
async function initialize() {
  try {
    await createAllFiles();
    await checkConfigFile();
  } catch (error) {
    logger.error('Error initializing the application:', error);
  }
}

await initialize();

program.name('obsidian-cli').description('CLI tool for managing Obsidian vaults').version('1.0.0');

program
  .command('delete')
  .description('Delete a specific note in your vault. Fuzzy searches through file names.')
  .argument('<title>', 'Title of the note you want to delete.')
  .action(async (title) => {
    await commands.deleteNote(title);
  });

program
  .command('edit')
  .description(
    'Search for a specific phrase in your Vault to edit. Fuzzy searches through files and contents.'
  )
  .argument('<phrase>', 'Phrase that you want to search for.')
  .action(async (phrase) => {
    await commands.editNote(phrase);
  });

program
  .command('create')
  .description('Create a note and edit it.')
  .argument('<title>', 'Title of the note.')
  .action(async (title) => {
    await commands.createNote(title);
  });

program
  .command('backup')
  .description('Backup your vault to a specified directory.')
  .argument('<backupPath>', 'Path to the backup location.')
  .action(async (backupPath) => {
    await commands.backupVault(backupPath);
  });

program
  .command('stats')
  .description('Displays statistics about your vault and its notes.')
  .action(async () => {
    await commands.getStats();
  });

program.parse(process.argv);
