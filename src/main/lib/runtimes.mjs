import execa from 'execa'
import { RuntimeApiClient } from '@platformatic/control'
import { createRequire } from 'node:module'
import { on } from 'node:events'
import { join } from 'node:path'
import { npmInstall } from './run-npm.mjs'
import Applications from './applications.mjs'
import split from 'split2'
const logger = require('pino')()

class Runtimes {
  #api
  #appDB
  #applications = []

  constructor (appDB) {
    this.#api = new RuntimeApiClient()
    this.#appDB = appDB
    this.#applications = []
  }

  // If there is a new running application, this is imported automatically
  async #createMissingApplications (runningRuntimes) {
    const apps = await this.#appDB.getApplications()
    for (const runtime of runningRuntimes) {
      let app = apps.find((app) => app.path === runtime.projectDir)
      if (!app) {
        app = await this.#appDB.addApplication({
          name: runtime.packageName,
          path: runtime.projectDir
        })
      }
    }
  }

  // TODO: This might be polled to refresh the current list of running runtimes
  async #refreshApplications () {
    const runningRuntimes = await this.#api.getRuntimes()
    await this.#createMissingApplications(runningRuntimes)
    const apps = await this.#appDB.getApplications()
    const ret = []

    for (const app of apps) {
      const runtime = runningRuntimes.find((runtime) => runtime.projectDir === app.path)
      if (runtime) {
        ret.push({
          id: app.id,
          name: app.name,
          path: app.path,
          running: true,
          runtime
        })
      } else {
        ret.push({
          id: app.id,
          name: app.name,
          path: app.path,
          running: false,
          runtime: null
        })
      }
    }
    this.#applications = ret
  }

  #getRuntimeCliPath (appFolder) {
    const pkgJsonPath = join(appFolder, 'package.json')
    const _require = createRequire(pkgJsonPath)
    return _require.resolve('@platformatic/runtime/runtime.mjs')
  }

  async startRuntime (appFolder, env = {}) {
    await npmInstall(null, { cwd: appFolder }, logger)
    const configFile = join(appFolder, 'platformatic.json')
    const runtimeCliPath = this.#getRuntimeCliPath(appFolder)
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
    await this.refreshRunningRuntimes()
  }

  async stopRuntime (pid) {
    await this.#api.stopRuntime(pid)
    await this.#refreshApplications()
  }

  async getApplications () {
    await this.#refreshApplications()
    return this.#applications
  }

  async createApplication (name, path) {
    return this.#appDB.addApplication({ name, path })
  }

  async deleteApplication (id) {
    return this.#appDB.deleteApplication(id)
  }

  static async create (merakiFolder, merakiConfigFolder) {
    const appDB = await Applications.create(merakiFolder, merakiConfigFolder)
    return new Runtimes(appDB)
  }
}

export default Runtimes
