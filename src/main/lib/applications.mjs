import execa from 'execa'
import { RuntimeApiClient } from '@platformatic/control'
import { createRequire } from 'node:module'
import { on } from 'node:events'
import { join } from 'node:path'
import { npmInstall } from './run-npm.mjs'
import getSqlMapper from './db.mjs'
import split from 'split2'
const logger = require('pino')()

class Applications {
  #runtimeApi
  #applications = []
  #mapper

  constructor (mapper) {
    this.#runtimeApi = new RuntimeApiClient()
    this.#mapper = mapper
    this.#applications = []
  }

  async #getApps () {
    return this.#mapper.entities.application.find({})
  }

  // If there is a new running application, this is imported automatically
  async #createMissingApplications (runningRuntimes) {
    const apps = await this.#getApps()
    for (const runtime of runningRuntimes) {
      let app = apps.find((app) => app.path === runtime.projectDir)
      if (!app) {
        app = await this.createApplication(runtime.packageName, runtime.projectDir)
      }
    }
  }

  // TODO: This might be polled to refresh the current list of running runtimes
  // and generate an event to notify the UI
  async #refreshApplications () {
    const runningRuntimes = await this.#runtimeApi.getRuntimes()
    await this.#createMissingApplications(runningRuntimes)
    const apps = await this.#getApps()
    const ret = []

    for (const app of apps) {
      const runtime = runningRuntimes.find((runtime) => runtime.projectDir === app.path)
      if (runtime) {
        ret.push({
          id: app.id,
          name: app.name,
          path: app.path,
          running: true,
          platformaticVersion: runtime.platformaticVersion,
          runtime
        })
      } else {
        ret.push({
          id: app.id,
          name: app.name,
          path: app.path,
          running: false,
          platformaticVersion: null,
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
    await this.#runtimeApi.stopRuntime(pid)
    await this.#refreshApplications()
  }

  async getApplications () {
    await this.#refreshApplications()
    return this.#applications
  }

  async createApplication (name, path) {
    return this.#mapper.entities.application.save({
      fields: ['name', 'path'],
      input: { name, path }
    })
  }

  async deleteApplication (id) {
    return this.#mapper.entities.application.delete({ where: { id: { eq: id } } })
  }

  static async create (merakiFolder, merakiConfigFolder) {
    // We use these environment variables for tests
    if (!merakiFolder) {
      merakiFolder = process.env.MERAKI_FOLDER
    }
    if (!merakiConfigFolder) {
      merakiConfigFolder = process.env.MERAKI_CONFIG_FOLDER
    }
    const mapper = await getSqlMapper(merakiFolder, merakiConfigFolder)
    return new Applications(mapper)
  }
}

export default Applications
