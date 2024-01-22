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

  return execa(currentShell, [`"-c . ${sourceFile}; ${command} ${args.join(' ')}"`], options)
}

export { runCommand }
