import { stat } from 'node:fs/promises'
import { setTimeout } from 'node:timers/promises'
import split from 'split2'

const installNpm = async (name, path, logger) => {
  const { execa } = await import('execa')
  logger.info({ name, path }, 'Installing ')
  await execa('npm', ['install', name], { cwd: path })
    .pipeStdout(split()).on('data', (line) => {
      logger.info(line)
    })
    .pipeStderr(split()).on('data', (line) => {
      logger.error(line)
    })

  logger.info({ name, path }, 'Installed')
}

// install all the names and return the list of the configurations, for the
// templates in a map <name> -> [configurations]
export const prepareFolder = async (path, templates, logger) => {
  const templateVariables = []
  const s = await stat(path)
  if (!s.isDirectory()) {
    logger.error({ path }, `Path ${path} is not a directory`)
    throw new Error(`Path ${path} is not a directory`)
  }

  try {
    for (const template of templates) {
      await installNpm(template, path, logger)
    }
  } catch (err) {
    logger.error(err)
    throw err
  }

  // TODO: get the template variables and return them here:
  return templateVariables
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
