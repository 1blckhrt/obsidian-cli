# Obsidian CLI

A simple CLI tool for managing your Obsidian note files in the terminal.

## Features

- **Edit Notes**: Use powerful fuzzy search to quickly locate the exact note you need, then launch it with your favorite terminal text editor.
- **Create Notes**: Generate a new note and jump straight into editing.
- **Delete Notes**: Remove outdated or unwanted notes.
- **Backup Vault**: Secure your notes by backing up your vault to a directory of your choice.
- **Stats**: Get a bird's-eye view of your vault with:
  - Total notes count
  - Total folders count
  - Total word count across all notes

## Getting Started

For detailed information on how to use the CLI tool, please run `obsidian-cli` without any arguments or flags to see the help menu.

Basic commands are listed below:

- `obsidian-cli delete <title>`
- `obsidian-cli edit <phrase>`
- `obsidian-cli create <title>`
- `obsidian-cli backup <path>`
- `obsidian-cli stats`

## Configuration

- Setting your vault path is done through a config file that is located at `~/.config/obsidian_cli/config.json`

- Logs can be viewed in the log file located at `~/.local/share/obsidian-cli/logs/obsidian-cli.log`
