import backupVault from './backup.js';
import createFile from './create.js';
import deleteFile from './delete.js';
import listFiles from './list.js';
import searchFiles from './search.js';
import getStats from './stats.js';

export const commands = {
  backupVault,
  createFile,
  deleteFile,
  listFiles,
  searchFiles,
  getStats,
};
