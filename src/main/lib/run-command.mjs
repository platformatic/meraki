import execa from 'execa'
import { app } from 'electron'

function runCommand (command, args, options) {
  if (process.platform === 'win32' || !app) {
    return execa(command, args, options)
  }

  // OSx and linux
  const DEFAULT_SHELL = process.platform === 'darwin' ? '/bin/zsh' : '/bin/bash'
  const currentShell = process.env.SHELL || DEFAULT_SHELL
  let sourceFile = '~/.zshrc'
  if (currentShell === '/bin/bash') {
    sourceFile = '~./bashrc'
  }

  // TODO: verificare se non fallisce. Se fallsice, provare con  
  // /usr/local/bin/npm e /usr/bin/npm (senza source, il cmando diventa 
  // `/usr/local/bin/npm install`.
  // Questo pero' prevede che questa funzione SAPPIA che sta eseguendo `npm`, quindi
  // 
  return execa(currentShell, ['-c', `". ${sourceFile}; ${command} ${args.join(' ')}"`], options)
}

export { runCommand }
