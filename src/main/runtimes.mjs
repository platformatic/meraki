import { tmpdir, platform } from 'node:os'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import log from 'electron-log/main'
import { setTimeout } from 'timers/promises'

let runtimeSockets = []

const getCurrentRuntimes = async (folder) => {
  try {
    log.debug('polling from', folder)
    const files = await readdir(folder)
    const constSocks = files
      .filter((file) => file.endsWith('.sock'))
      .map((file) => join(folder, file))

    runtimeSockets = constSocks.map((sockFile) => {
      if (platform() === 'win32') {
        return '\\\\.\\pipe\\' + sockFile
      }
      return sockFile
    })
  } catch (e) {
    if (e.code === 'ENOENT') {
      log.debug('No path found:', e.path)
    } else {
      log.error(e)
    }
  }
}

const getSockets = () => {
  return runtimeSockets
}

const poll = async () => {
  const pollInterval = Number(process.env.RUNTIME_POLL_INTERVAL) || 2000
  const runtimeFolder = process.env.PLATFORMATIC_TMP_DIR || join(tmpdir(), 'platformatic', 'pids')
  while (true) {
    await getCurrentRuntimes(runtimeFolder)
    await setTimeout(pollInterval)
  }
}

export default { poll, getSockets }
