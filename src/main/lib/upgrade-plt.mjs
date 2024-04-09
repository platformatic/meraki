'use strict'

import { join } from 'node:path'
import { stat, access, readdir } from 'fs/promises'
import { npmInstall } from './run-npm.mjs'
import * as ncu from 'npm-check-updates'

const upgradePlt = async (options, logger) => {
  const folder = options.cwd

  if (!folder) {
    logger.error('cwd is not defined')
    return
  }
  const s = await stat(folder)
  if (!s.isDirectory()) {
    logger.info(`Path ${folder} is not a directory, not running npm install`)
    return
  }

  // Update all platformatic packages in the root folder
  await ncu.run({
    packageFile: 'package.json',
    upgrade: true,
    cwd: folder,
    install: 'never',
    filter: ['@platformatic/*', 'platformatic*']
  })

  await npmInstall(null, { cwd: folder }, logger)

  // And for each service.
  const servicesFolder = join(folder, 'services')
  const services = await readdir(servicesFolder)
  for (const service of services) {
    const serviceFolder = join(servicesFolder, service)
    const serviceJson = join(serviceFolder, 'package.json')

    try {
      await access(serviceJson)
    } catch (e) {
      // the file does not exist, just skip
      continue
    }

    await ncu.run({
      packageFile: serviceJson,
      upgrade: true,
      cwd: serviceFolder,
      install: 'never',
      filter: ['@platformatic/*', 'platformatic*']
    })
    await npmInstall(null, { cwd: serviceFolder }, logger)
  }
}

export { upgradePlt }
