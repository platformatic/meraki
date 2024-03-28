import execa from 'execa'
import { RuntimeApiClient } from '@platformatic/control'
import { access, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { npmInstall } from './run-npm.mjs'
import { getLatestPlatformaticVersion, findExecutable } from './utils.mjs'
import { resolve, join } from 'node:path'
import getSqlMapper from './db.mjs'
import { inspectApp } from './inspect-app.mjs'
import split from 'split2'
import pino from 'pino'
const logger = pino()

class Applications {
  #runtimeClient
  #applications = []
  #started // map application id => pid for apps started by meraki
  #mapper

  constructor (mapper, latestPlatformaticVersion) {
    this.#runtimeClient = new RuntimeApiClient()
    this.#mapper = mapper
    this.#applications = []
    this.#started = {}
    this.latestPlatformaticVersion = latestPlatformaticVersion
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
        app = await this.createApplication(runtime.packageName, runtime.projectDir, true)
      }
    }
  }

  // TODO: This might be polled to refresh the current list of running runtimes
  // and generate an event to notify the UI

  async #refreshApplications () {
    const runningRuntimes = await this.#runtimeClient.getRuntimes()
    await this.#createMissingApplications(runningRuntimes)
    const apps = await this.#getApps()
    const ret = []

    for (const app of apps) {
      const appForList = {
        id: app.id,
        name: app.name,
        path: app.path,
        running: false,
        status: 'stopped',
        platformaticVersion: app.lastPltVersion,
        isLatestPltVersion: app.lastPltVersion === this.latestPlatformaticVersion,
        runtime: null,
        insideMeraki: false,
        lastStarted: app.startedAt,
        lastUpdated: app.updatedAt,
        createdAt: app.createdAt,
        automaticallyImported: !!app.automaticallyImported
      }
      const runtime = runningRuntimes.find((runtime) => runtime.projectDir === app.path)
      if (runtime) {
        appForList.running = true
        appForList.status = 'running'
        appForList.platformaticVersion = runtime.platformaticVersion
        appForList.isLatestPltVersion = (runtime.platformaticVersion === this.latestPlatformaticVersion)
        appForList.runtime = runtime
        appForList.insideMeraki = !!this.#started[app.id]
        // We need to update the lastPltVersion if unknown or it's different
        if (!app.lastPltVersion || app.lastPltVersion !== runtime.platformaticVersion) {
          await this.#mapper.entities.application.save({
            fields: ['id', 'lastPltVersion'],
            input: { id: app.id, lastPltVersion: runtime.platformaticVersion }
          })
        }
      }
      ret.push(appForList)
    }

    this.#applications = ret
  }

  #getRuntimeCliPath (appFolder) {
    const pkgJsonPath = join(appFolder, 'package.json')
    const _require = createRequire(pkgJsonPath)
    return _require.resolve('@platformatic/runtime/runtime.mjs')
  }

  async startRuntime (id, env = {}) {
    const app = await this.#mapper.entities.application.find({ where: { id: { eq: id } } })
    if (!app || app.length === 0) {
      throw new Error(`Application with id ${id} not found`)
    }
    const appFolder = app[0].path
    await npmInstall(null, { cwd: appFolder }, logger)
    const configFile = join(appFolder, 'platformatic.json')
    const runtimeCliPath = this.#getRuntimeCliPath(appFolder)
    // We canot use `process.execPath` because it's the path to the electron binary
    const nodePath = await findExecutable('node')
    const runtime = execa(
      nodePath, [runtimeCliPath, 'start', '-c', configFile],
      { env, cleanup: true, cwd: appFolder }
    )

    const output = runtime.stdout.pipe(split((line) => {
      try {
        const obj = JSON.parse(line)
        return obj
      } catch (err) {
        logger.error(err)
      }
    }))

    const errorLines = []
    runtime.stderr.pipe(split((line) => {
      errorLines.push(line)
    }))

    const errorTimeout = setTimeout(() => {
      throw new Error('Couldn\'t start server')
    }, 30000)

    // Here we check every message of the runtime output only to check if the runtime is started
    for await (const message of output) {
      if (message.msg) {
        const url = message.url ??
          message.msg.match(/server listening at (.+)/i)?.[1]

        if (url !== undefined) {
          clearTimeout(errorTimeout)
          this.#started[id] = runtime.pid
          this.#mapper.entities.application.save({
            fields: ['id', 'startedAt'],
            input: { id, startedAt: new Date() }
          })
          await this.#refreshApplications()
          return { runtime, id, url }
        }
      }
    }

    // If we reach this point, stdout is closed and the runtime is not started, checkint stderr
    if (errorLines.length > 0) {
      throw new Error(`Error in starting the runtime: ${errorLines.join('\n')}`)
    }
    throw new Error('Couldn\'t start server, check the logs')
  }

  async stopRuntime (id) {
    const pid = this.#started[id]
    if (pid) {
      await this.#runtimeClient.stopRuntime(pid)
      delete this.#started[id]
    }
    await this.#refreshApplications()
  }

  async getApplications () {
    await this.#refreshApplications()
    return this.#applications
  }

  getPid (id) {
    const pid = this.#started[id]
    if (pid) {
      return pid
    }

    // Can be the id of an application not started by meraki.
    const application = this.#applications.find((app) => app.id === id)
    if (!application) {
      throw new Error(`Application with id ${id} not found, cannot extract PID`)
    }
    if (application.running) {
      return application.runtime.pid
    }
    throw new Error(`Application with id ${id} is not running`)
  }

  getApplication (id) {
    return this.#applications.find((app) => app.id === id)
  }

  async importApplication (path, folderName) {
    const packageJsonPath = resolve(path, 'package.json')
    try {
      await access(packageJsonPath)
    } catch (err) {
      throw new Error(`Import error: cannot find package.json in the provided path, ${path}`)
    }
    const packageJson = require(packageJsonPath)
    let { name } = packageJson
    // This is a workaround for a plt bug that sets the name to "undefined"
    // TODO: remove
    if (name && name === 'undefined') {
      name = folderName
    }
    const app = this.createApplication(name || folderName, path)
    await this.#refreshApplications()
    return app
  }

  async createApplication (name, path, automaticallyImported = false) {
    return this.#mapper.entities.application.save({
      fields: ['id', 'name', 'path', 'automaticallyImported'],
      input: { name, path, automaticallyImported }
    })
  }

  async updateApplication (id, name) {
    return this.#mapper.entities.application.save({
      fields: ['id', 'name'],
      input: { id, name }
    })
  }

  async openApplication (id) {
    const app = await this.getApplication(id)
    if (!app) {
      throw new Error(`Application with id ${id} not found`)
    }
    const appFolder = app.path
    const [application, appMetadata] = await Promise.all([this.getApplication(id), inspectApp(appFolder)])
    return { ...application, ...appMetadata }
  }

  async deleteApplication (id, opts = { removeFolder: false }) {
    const { removeFolder } = opts
    const app = await this.getApplication(id)
    const appFolder = app.path
    const ret = await this.#mapper.entities.application.delete({ where: { id: { eq: id } } })
    if (removeFolder) {
      await rm(appFolder, { recursive: true })
    }
    return ret
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
    const latestPlatformaticVersion = await getLatestPlatformaticVersion()
    return new Applications(mapper, latestPlatformaticVersion)
  }
}

export default Applications
