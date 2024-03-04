import execa from 'execa'
import { RuntimeApiClient } from '@platformatic/control'
import { createRequire } from 'node:module'
import { on } from 'node:events'
import { join } from 'node:path'
import { npmInstall } from './run-npm.mjs'
import split from 'split2'
const logger = require('pino')()

const getRuntimeCliPath = (appFolder) => {
  const pkgJsonPath = join(appFolder, 'package.json')
  const _require = createRequire(pkgJsonPath)
  const runtimeCliPath = _require.resolve('@platformatic/runtime/runtime.mjs')
  return runtimeCliPath
}

class Runtimes {
  #api
  constructor () {
    this.#api = new RuntimeApiClient()
    this.runtimes = []
  }

  async getRuntimes () {
    const runtimes = await this.#api.getRuntimes()
    return runtimes
  }

  async startRuntime (appFolder, env = {}) {
    await npmInstall(null, { cwd: appFolder }, logger)
    const configFile = join(appFolder, 'platformatic.json')
    const runtimeCliPath = getRuntimeCliPath(appFolder)
    const runtime = execa(
      process.execPath, [runtimeCliPath, 'start', '-c', configFile],
      { env }
    )
    runtime.stdout.pipe(process.stdout)
    runtime.stderr.pipe(process.stderr)

    const output = runtime.stdout.pipe(split(function (line) {
      try {
        const obj = JSON.parse(line)
        return obj
      } catch (err) {
        console.log(line)
      }
    }))

    const errorTimeout = setTimeout(() => {
      throw new Error('Couldn\'t start server')
    }, 30000)

    for await (const messages of on(output, 'data')) {
      for (const message of messages) {
        if (message.msg) {
          const url = message.url ??
          message.msg.match(/server listening at (.+)/i)?.[1]

          if (url !== undefined) {
            clearTimeout(errorTimeout)
            return { runtime, url, output }
          }
        }
      }
    }
  }

  async stopRuntime (pid) {
    await this.#api.stopRuntime(pid)
  }
}

export default Runtimes
