'use strict'

import createError from '@fastify/error'

const ERROR_PREFIX = 'PLT_APP'

const errors = {
  CannotGetStackablesError: createError(`${ERROR_PREFIX}_CANNOT_GET_STACKABLES`, 'Cannot get stackables %s'),
  CannotGetPluginsError: createError(`${ERROR_PREFIX}_CANNOT_GET_PLUGINS`, 'Cannot get plugins'),
  ConfigNotParsableError: createError(`${ERROR_PREFIX}_CANNOT_PARSE_CONFIG`, 'Config file not parsable %s'),
  UnauthorizedError: createError(`${ERROR_PREFIX}_UNAUTHORIZED`, 'Unauthorized'),
  NoServicesError: createError(`${ERROR_PREFIX}_NO_SERVICES`, 'No services to create'),
  NoEntrypointError: createError(`${ERROR_PREFIX}_NO_ENTRYPOINT`, 'No entrypoint')

}

export default errors
