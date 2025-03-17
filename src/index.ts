#!/usr/bin/env node
import process from 'node:process'
import { program } from 'commander'

function listFiles() {
  console.log('Listing files.')
}

function searchFiles(phrase: string) {
  console.log(`Searching files for the phrase ${phrase}`)
}

function createFile(title: string) {
  console.log(`Creating note with the title ${title}`)
}

function backupVault(backupPath: string) {
  console.log(`Backing up vault to ${backupPath}`)
}

program.name('obsidian-cli').description('CLI tool for managing Obsidian vaults').version('1.0.0')

program
  .command('list')
  .description('Lists all files in your vault.')
  .action(() => {
    listFiles()
  })

program
  .command('search')
  .description('Search for a specific phrase in your Vault.')
  .argument('<phrase>', 'Phrase that you want to search for')
  .action((phrase) => {
    searchFiles(phrase)
  })

program
  .command('create')
  .description('Create a note with a specific title.')
  .argument('<title>', 'Title of the note')
  .action((title) => {
    createFile(title)
  })

program
  .command('backup')
  .description('Backup your vault to a specified directory')
  .argument('<backupPath>', 'Path to the backup location')
  .action((backupPath) => {
    backupVault(backupPath)
  })

program.parse(process.argv)
