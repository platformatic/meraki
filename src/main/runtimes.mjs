import { tmpdir, platform } from 'node:os'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import log from 'electron-log/main'
import EventEmitter from 'node:events'

class RuntimeEmitter extends EventEmitter {
  #sockets
  #interval

  constructor () {
    super()
    this.#sockets = []
  }

  async #getCurrentRuntimes (folder) {
    try {
      log.debug('polling from', folder)
      const files = await readdir(folder)
      const constSocks = files
        .filter((file) => file.endsWith('.sock'))
        .map((file) => join(folder, file))

      this.#sockets = constSocks.map((sockFile) => {
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

  async #poll () {
    const pollInterval = Number(process.env.RUNTIME_POLL_INTERVAL) || 2000
    const runtimeFolder = process.env.PLATFORMATIC_TMP_DIR || join(tmpdir(), 'platformatic', 'pids')
    this.#interval = setInterval(async () => {
      await this.#getCurrentRuntimes(runtimeFolder)
    }, pollInterval)
  }

  start () {
    this.#poll()
  }

  async stop () {
    clearInterval(this.#interval)
  }

  get sockets () {
    return this.#sockets
  }
}

export default RuntimeEmitter
