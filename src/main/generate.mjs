const {
  setTimeout
} = require('node:timers/promises')

export const prepareFolder = async (path, logger) => {
  // TODO: this check that the folder exists (it should)  and `npm install` what is necessary
  // for the creation
  logger.info('Preparing folder')
  await setTimeout(3000)
  logger.info('Folder prepared')
}

export const createApp = async (path, logger) => {
  // TODO: implement
  logger.info('Creating app')
  await setTimeout(1000)
  logger.info('first step')
  await setTimeout(1000)
  logger.info('second step')
  await setTimeout(1000)
  logger.info('App created!')
}
