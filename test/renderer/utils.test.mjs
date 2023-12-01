import { test, expect } from 'vitest'
import { generateForm } from '../../src/renderer/src/utils'

test('return service on form without plugin', async () => {
  const servicesReceived =
    [
      {
        template: {
          orgId: 'platformatic',
          orgName: 'Platformatic',
          name: '@platformatic/service',
          description: 'A Platformatic Service is an HTTP server based on Fastify that allows developers to build robust APIs with Node.js',
          author: 'Platformatic',
          homepage: 'https://platformatic.dev',
          public: true,
          platformaticService: true,
          envVars: [
            {
              var: 'PLT_SERVER_HOSTNAME',
              label: 'What is the hostname?',
              default: '0.0.0.0',
              type: 'string',
              configValue: 'hostname'
            },
            {
              var: 'PLT_SERVER_LOGGER_LEVEL',
              label: 'What is the logger level?',
              default: 'info',
              type: 'string',
              configValue: ''
            },
            {
              label: 'Which port do you want to use?',
              var: 'PORT',
              default: 3042,
              tyoe: 'number',
              configValue: 'port'
            }
          ]
        },
        name: 'test-1',
        plugins: []
      }
    ]

  const expected = [{
    name: 'test-1',
    template: '@platformatic/service',
    form: {
      PLT_SERVER_HOSTNAME: {
        configValue: 'hostname',
        label: 'What is the hostname?',
        type: 'string',
        value: '0.0.0.0',
        var: 'PLT_SERVER_HOSTNAME'
      },
      PLT_SERVER_LOGGER_LEVEL: {
        configValue: '',
        label: 'What is the logger level?',
        type: 'string',
        value: 'info',
        var: 'PLT_SERVER_LOGGER_LEVEL'
      },
      PORT: {
        configValue: 'port',
        label: 'Which port do you want to use?',
        value: '3042',
        var: 'PORT'
      }
    },
    validForm: true,
    validations: {
      PLT_SERVER_HOSTNAMEValid: true,
      PLT_SERVER_LOGGER_LEVELValid: true,
      PORTValid: true,
      formErrors: {
        PLT_SERVER_HOSTNAME: '',
        PLT_SERVER_LOGGER_LEVEL: '',
        PORT: ''
      }
    },
    plugins: []
  }]

  expect(expected).toEqual(generateForm(servicesReceived, false))
})

test('return service on form with a single plugin', async () => {
  const servicesReceived =
      [
        {
          template: {
            orgId: 'platformatic',
            orgName: 'Platformatic',
            name: '@platformatic/service',
            description: 'A Platformatic Service is an HTTP server based on Fastify that allows developers to build robust APIs with Node.js',
            author: 'Platformatic',
            homepage: 'https://platformatic.dev',
            public: true,
            platformaticService: true,
            envVars: [
              {
                var: 'PLT_SERVER_HOSTNAME',
                label: 'What is the hostname?',
                default: '0.0.0.0',
                type: 'string',
                configValue: 'hostname'
              },
              {
                var: 'PLT_SERVER_LOGGER_LEVEL',
                label: 'What is the logger level?',
                default: 'info',
                type: 'string',
                configValue: ''
              },
              {
                label: 'Which port do you want to use?',
                var: 'PORT',
                default: 3042,
                tyoe: 'number',
                configValue: 'port'
              }
            ]
          },
          plugins: [
            {
              name: '@fastify/accepts',
              description: 'To have accepts in your request object.',
              author: 'mock author',
              homepage: 'https://example.com',
              envVars: [
                {
                  name: 'PLT_COOKIE_SECRET',
                  path: 'secret',
                  type: 'string'
                },
                {
                  name: 'PLT_COOKIE_HOOK',
                  path: 'hook',
                  type: 'string'
                },
                {
                  name: 'PLT_COOKIE_PARSEOPTIONS_DOMAIN',
                  path: 'parseOptions.domain',
                  type: 'string'
                },
                {
                  name: 'PLT_COOKIE_PASEOPTIONS_MAXAGE',
                  path: 'parseOptions.maxAge',
                  type: 'number'
                }
              ]
            }
          ],
          name: 'lunasa-1'
        }
      ]

  const expected = [{
    name: 'lunasa-1',
    template: '@platformatic/service',
    form: {
      PLT_SERVER_HOSTNAME: {
        configValue: 'hostname',
        label: 'What is the hostname?',
        type: 'string',
        value: '0.0.0.0',
        var: 'PLT_SERVER_HOSTNAME'
      },
      PLT_SERVER_LOGGER_LEVEL: {
        configValue: '',
        label: 'What is the logger level?',
        type: 'string',
        value: 'info',
        var: 'PLT_SERVER_LOGGER_LEVEL'
      },
      PORT: {
        configValue: 'port',
        label: 'Which port do you want to use?',
        value: '3042',
        var: 'PORT'
      }
    },
    validForm: true,
    validations: {
      PLT_SERVER_HOSTNAMEValid: true,
      PLT_SERVER_LOGGER_LEVELValid: true,
      PORTValid: true,
      formErrors: {
        PLT_SERVER_HOSTNAME: '',
        PLT_SERVER_LOGGER_LEVEL: '',
        PORT: ''
      }
    },
    plugins: [{
      name: '@fastify/accepts',
      form: {
        PLT_COOKIE_SECRET: {
          value: '',
          path: 'secret',
          type: 'string'
        },
        PLT_COOKIE_HOOK: {
          value: '',
          path: 'hook',
          type: 'string'
        },
        PLT_COOKIE_PARSEOPTIONS_DOMAIN: {
          value: '',
          path: 'parseOptions.domain',
          type: 'string'
        },
        PLT_COOKIE_PASEOPTIONS_MAXAGE: {
          value: '',
          path: 'parseOptions.maxAge',
          type: 'number'
        }
      },
      validForm: false,
      validations: {
        PLT_COOKIE_SECRETValid: false,
        PLT_COOKIE_HOOKValid: false,
        PLT_COOKIE_PARSEOPTIONS_DOMAINValid: false,
        PLT_COOKIE_PASEOPTIONS_MAXAGEValid: false,
        formErrors: {
          PLT_COOKIE_SECRET: '',
          PLT_COOKIE_HOOK: '',
          PLT_COOKIE_PARSEOPTIONS_DOMAIN: '',
          PLT_COOKIE_PASEOPTIONS_MAXAGE: ''
        }
      }
    }]
  }]

  expect(expected).toEqual(generateForm(servicesReceived, false))
})
