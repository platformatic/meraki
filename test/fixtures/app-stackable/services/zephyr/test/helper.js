'use strict'

const { join } = require('node:path')
const { readFile } = require('node:fs/promises')
const { buildServer } = require('@platformatic/service')

async function getServer (t) {
  const config = JSON.parse(await readFile(join(__dirname, '..', 'platformatic.json'), 'utf8'))
  // Add your config customizations here. For example you want to set
  // all things that are set in the config file to read from an env variable
  config.server ||= {}
  config.server.logger ||= {}
  config.watch = false

  // Add your config customizations here
  const server = await buildServer(config)
  t.after(() => server.close())

  return server
}

module.exports.getServer = getServer
