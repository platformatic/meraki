import { test, expect } from 'vitest'
import {
  generateForm,
  prepareFormForCreateApplication,
  generateFormForViewEnvironmentVariable,
  prepareStoreForEditApplication
} from '../../src/renderer/src/utils'

const expectedA = [{
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

const expectedB = [{
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

  expect(expectedA).toEqual(generateForm(servicesReceived, false))
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

  expect(expectedB).toEqual(generateForm(servicesReceived, false))
})

test('prepare services without plugins', async () => {
  const expected = [{
    name: 'test-1',
    template: '@platformatic/service',
    fields: [{
      configValue: 'hostname',
      type: 'string',
      value: '0.0.0.0',
      var: 'PLT_SERVER_HOSTNAME'
    }, {
      configValue: '',
      type: 'string',
      value: 'info',
      var: 'PLT_SERVER_LOGGER_LEVEL'
    }, {
      configValue: 'port',
      value: '3042',
      var: 'PORT'
    }],
    plugins: []
  }]
  expect(expected).toEqual(prepareFormForCreateApplication(expectedA))
})

test('prepare services with a single plugins', async () => {
  const expected = [{
    name: 'lunasa-1',
    template: '@platformatic/service',
    fields: [{
      configValue: 'hostname',
      type: 'string',
      value: '0.0.0.0',
      var: 'PLT_SERVER_HOSTNAME'
    }, {
      configValue: '',
      type: 'string',
      value: 'info',
      var: 'PLT_SERVER_LOGGER_LEVEL'
    }, {
      configValue: 'port',
      value: '3042',
      var: 'PORT'
    }],
    plugins: [{
      name: '@fastify/accepts',
      options: [{
        name: 'PLT_COOKIE_SECRET',
        path: 'secret',
        type: 'string',
        value: ''
      }, {
        name: 'PLT_COOKIE_HOOK',
        path: 'hook',
        type: 'string',
        value: ''
      }, {
        name: 'PLT_COOKIE_PARSEOPTIONS_DOMAIN',
        path: 'parseOptions.domain',
        type: 'string',
        value: ''
      }, {
        name: 'PLT_COOKIE_PASEOPTIONS_MAXAGE',
        path: 'parseOptions.maxAge',
        type: 'number',
        value: ''
      }]
    }]
  }]
  expect(expected).toEqual(prepareFormForCreateApplication(expectedB))
})

test('prepare services with multiple templates and plugins for environment variable', async () => {
  const servicesReceived = [
    {
      id: 'acoustics',
      path: '/Users/antonio/Documents/meraki-test/multiple-app/services/acoustics',
      configPath: '/Users/antonio/Documents/meraki-test/multiple-app/services/acoustics/platformatic.json',
      config: {
        $schema: 'https://platformatic.dev/schemas/v1.26.0/service',
        service: {
          openapi: true
        },
        watch: true,
        plugins: {
          paths: [
            {
              path: './plugins',
              encapsulate: false
            },
            './routes'
          ],
          typescript: '{PLT_ACOUSTICS_TYPESCRIPT}',
          packages: [
            {
              name: '@fastify/http-proxy',
              options: {
                upstream: '{PLT_ACOUSTICS_FST_PLUGIN_HTTP_PROXY_UPSTREAM}',
                prefix: '{PLT_ACOUSTICS_FST_PLUGIN_HTTP_PROXY_PREFIX}',
                http2: '{PLT_ACOUSTICS_FST_PLUGIN_HTTP_PROXY_HTTP2}'
              }
            },
            {
              name: '@fastify/compress',
              options: {}
            },
            {
              name: '@fastify/accepts',
              options: {}
            },
            {
              name: '@fastify/passport',
              options: {
                session: '{PLT_ACOUSTICS_FST_PLUGIN_PASSPORT_SESSION}'
              }
            }
          ]
        }
      },
      env: {
        PLT_ACOUSTICS_TYPESCRIPT: 'false',
        PLT_ACOUSTICS_FST_PLUGIN_HTTP_PROXY_UPSTREAM: 'http://single-signon.example.com',
        PLT_ACOUSTICS_FST_PLUGIN_HTTP_PROXY_PREFIX: '/signon',
        PLT_ACOUSTICS_FST_PLUGIN_HTTP_PROXY_HTTP2: 'false',
        PLT_ACOUSTICS_FST_PLUGIN_PASSPORT_SESSION: 'true'
      },
      template: '@platformatic/service',
      plugins: [
        {
          name: '@fastify/http-proxy',
          options: {
            upstream: '{PLT_ACOUSTICS_FST_PLUGIN_HTTP_PROXY_UPSTREAM}',
            prefix: '{PLT_ACOUSTICS_FST_PLUGIN_HTTP_PROXY_PREFIX}',
            http2: '{PLT_ACOUSTICS_FST_PLUGIN_HTTP_PROXY_HTTP2}'
          }
        },
        {
          name: '@fastify/compress',
          options: {}
        },
        {
          name: '@fastify/accepts',
          options: {}
        },
        {
          name: '@fastify/passport',
          options: {
            session: '{PLT_ACOUSTICS_FST_PLUGIN_PASSPORT_SESSION}'
          }
        }
      ],
      templateEnvVariables: [],
      pluginsDesc: [
        {
          id: '243db47a-5dc4-43e1-b9a1-0629b3fbed53',
          name: '@fastify/accepts',
          description: 'Add accept parser to fastify',
          author: 'allevo',
          homepage: 'https://github.com/fastify/fastify-accepts#readme',
          tags: [],
          latestVersion: '4.3.0',
          createdAt: '1701793853798',
          releasedAt: '1701591069000',
          downloads: 1127588,
          supportedBy: 'Fastify',
          supportedByUrl: 'https://fastify.dev',
          supportedByIcon: ' https://fastify.dev/img/logos/fastify-white.svg ',
          envVars: []
        },
        {
          id: '32158786-7a4f-4968-aba5-329304ef31e1',
          name: '@fastify/passport',
          description: 'Simple, unobtrusive authentication for Fastify.',
          author: '',
          homepage: 'http://passportjs.org/',
          tags: [
            'fastify',
            'auth',
            'authentication'
          ],
          latestVersion: '2.4.0',
          createdAt: '1701794410163',
          releasedAt: '1696329919000',
          downloads: 64784,
          supportedBy: '',
          supportedByUrl: '',
          supportedByIcon: '',
          envVars: [
            {
              name: 'FST_PLUGIN_PASSPORT_SESSION',
              path: 'session',
              type: 'boolean',
              description: 'Save login state in session, defaults to true',
              default: 'true'
            }
          ]
        },
        {
          id: '51da5a4d-ed37-4e9d-a43b-37c5baa1fa14',
          name: '@fastify/compress',
          description: 'Fastify compression utils',
          author: 'Tomas Della Vedova - @delvedor',
          homepage: 'https://github.com/fastify/fastify-compress#readme',
          tags: [
            'fastify',
            'compression',
            'deflate',
            'gzip',
            'brotli'
          ],
          latestVersion: '7.0.0',
          createdAt: '1701793727770',
          releasedAt: '1706611818000',
          downloads: 266957,
          supportedBy: 'Fastify',
          supportedByUrl: 'https://fastify.dev',
          supportedByIcon: ' https://fastify.dev/img/logos/fastify-white.svg ',
          envVars: []
        },
        {
          id: '59887ba1-f758-493b-bfe9-d8b332ca1d6d',
          name: '@fastify/http-proxy',
          description: 'proxy http requests, for Fastify',
          author: 'Matteo Collina',
          homepage: 'https://github.com/fastify/fastify-http-proxy#readme',
          tags: [
            'fastify',
            'http',
            'proxy'
          ],
          latestVersion: '9.4.0',
          createdAt: '1701793068662',
          releasedAt: '1706779404000',
          downloads: 1324578,
          supportedBy: 'Fastify',
          supportedByUrl: 'https://fastify.dev',
          supportedByIcon: ' https://fastify.dev/img/logos/fastify-white.svg ',
          envVars: [
            {
              name: 'FST_PLUGIN_HTTP_PROXY_UPSTREAM',
              path: 'upstream',
              type: 'string',
              description: 'An URL (including protocol) that represents the target server to use for proxying.',
              default: 'http://single-signon.example.com'
            },
            {
              name: 'FST_PLUGIN_HTTP_PROXY_PREFIX',
              path: 'prefix',
              type: 'string',
              description: 'The prefix to mount this plugin on.',
              default: '/signon'
            },
            {
              name: 'FST_PLUGIN_HTTP_PROXY_HTTP2',
              path: 'http2',
              type: 'boolean',
              description: 'Whether to use HTTP/2 for proxying.',
              default: 'false'
            }
          ]
        }
      ],
      templateDesc: [
        {
          id: 'a16bd72d-6ead-426c-aa27-5fc5cfc33a35',
          name: '@platformatic/service',
          description: 'A Platformatic Service is an HTTP server based on Fastify that allows developers to build robust APIs with Node.js',
          author: 'Matteo Collina',
          homepage: 'https://github.com/platformatic/platformatic#readme',
          orgId: 'platformatic',
          orgName: 'Platformatic',
          public: true,
          platformaticService: true,
          tags: [
            'Platformatic',
            'service',
            'API'
          ],
          downloads: 973510,
          latestVersion: '1.26.0',
          createdAt: '1705329121747',
          releasedAt: '1709820212000',
          publicRequest: false,
          supportedBy: '',
          supportedByUrl: '',
          supportedByIcon: '',
          npmPackageName: '@platformatic/service'
        }
      ]
    },
    {
      id: 'carrot',
      path: '/Users/antonio/Documents/meraki-test/multiple-app/services/carrot',
      configPath: '/Users/antonio/Documents/meraki-test/multiple-app/services/carrot/platformatic.json',
      config: {
        $schema: 'https://platformatic.dev/schemas/v1.26.0/service',
        service: {
          openapi: true
        },
        watch: true,
        plugins: {
          paths: [
            {
              path: './plugins',
              encapsulate: false
            },
            './routes'
          ],
          typescript: '{PLT_CARROT_TYPESCRIPT}'
        }
      },
      env: {
        PLT_CARROT_TYPESCRIPT: 'false'
      },
      template: '@platformatic/service',
      plugins: [],
      templateEnvVariables: [],
      pluginsDesc: [],
      templateDesc: [
        {
          id: 'a16bd72d-6ead-426c-aa27-5fc5cfc33a35',
          name: '@platformatic/service',
          description: 'A Platformatic Service is an HTTP server based on Fastify that allows developers to build robust APIs with Node.js',
          author: 'Matteo Collina',
          homepage: 'https://github.com/platformatic/platformatic#readme',
          orgId: 'platformatic',
          orgName: 'Platformatic',
          public: true,
          platformaticService: true,
          tags: [
            'Platformatic',
            'service',
            'API'
          ],
          downloads: 973510,
          latestVersion: '1.26.0',
          createdAt: '1705329121747',
          releasedAt: '1709820212000',
          publicRequest: false,
          supportedBy: '',
          supportedByUrl: '',
          supportedByIcon: '',
          npmPackageName: '@platformatic/service'
        }
      ]
    }
  ]

  const expected = [{
    name: 'acoustics',
    template: '@platformatic/service',
    form: {},
    validForm: true,
    validations: {},
    plugins: [{
      name: '@fastify/http-proxy',
      form: {
        FST_PLUGIN_HTTP_PROXY_UPSTREAM: {
          value: 'http://single-signon.example.com',
          path: 'upstream',
          description: 'An URL (including protocol) that represents the target server to use for proxying.'
        },
        FST_PLUGIN_HTTP_PROXY_PREFIX: {
          value: '/signon',
          path: 'prefix',
          description: 'The prefix to mount this plugin on.'
        },
        FST_PLUGIN_HTTP_PROXY_HTTP2: {
          value: 'false',
          path: 'http2',
          description: 'Whether to use HTTP/2 for proxying.'
        }
      },
      validForm: true,
      validations: {
        FST_PLUGIN_HTTP_PROXY_UPSTREAMValid: true,
        FST_PLUGIN_HTTP_PROXY_PREFIXValid: true,
        FST_PLUGIN_HTTP_PROXY_HTTP2Valid: true,
        formErrors: {
          FST_PLUGIN_HTTP_PROXY_UPSTREAM: '',
          FST_PLUGIN_HTTP_PROXY_PREFIX: '',
          FST_PLUGIN_HTTP_PROXY_HTTP2: ''
        }
      }
    }, {
      name: '@fastify/compress',
      form: {},
      validForm: true,
      validations: {
        formErrors: {}
      }
    }, {
      name: '@fastify/accepts',
      form: {},
      validForm: true,
      validations: {
        formErrors: {}
      }
    }, {
      name: '@fastify/passport',
      form: {
        FST_PLUGIN_PASSPORT_SESSION: {
          value: 'true',
          path: 'session',
          description: 'Save login state in session, defaults to true'
        }
      },
      validForm: true,
      validations: {
        FST_PLUGIN_PASSPORT_SESSIONValid: true,
        formErrors: {
          FST_PLUGIN_PASSPORT_SESSION: ''
        }
      }
    }]
  }, {
    name: 'carrot',
    template: '@platformatic/service',
    form: {},
    validForm: true,
    validations: {},
    plugins: []
  }]
  const result = generateFormForViewEnvironmentVariable(servicesReceived)
  expect(expected).toEqual(result)
})

test('prepare services with a single plugins', async () => {
  const expected = [{
    name: 'lunasa-1',
    template: '@platformatic/service',
    fields: [{
      configValue: 'hostname',
      type: 'string',
      value: '0.0.0.0',
      var: 'PLT_SERVER_HOSTNAME'
    }, {
      configValue: '',
      type: 'string',
      value: 'info',
      var: 'PLT_SERVER_LOGGER_LEVEL'
    }, {
      configValue: 'port',
      value: '3042',
      var: 'PORT'
    }],
    plugins: [{
      name: '@fastify/accepts',
      options: [{
        name: 'PLT_COOKIE_SECRET',
        path: 'secret',
        type: 'string',
        value: ''
      }, {
        name: 'PLT_COOKIE_HOOK',
        path: 'hook',
        type: 'string',
        value: ''
      }, {
        name: 'PLT_COOKIE_PARSEOPTIONS_DOMAIN',
        path: 'parseOptions.domain',
        type: 'string',
        value: ''
      }, {
        name: 'PLT_COOKIE_PASEOPTIONS_MAXAGE',
        path: 'parseOptions.maxAge',
        type: 'number',
        value: ''
      }]
    }]
  }]
  expect(expected).toEqual(prepareFormForCreateApplication(expectedB))
})

test('prepare services with multiple templates and plugins for environment variable - 2', async () => {
  const servicesReceived = [
    {
      id: 'husband',
      path: '/Users/antonio/Documents/meraki-test/db-service-test/services/husband',
      configPath: '/Users/antonio/Documents/meraki-test/db-service-test/services/husband/platformatic.json',
      config: {
        $schema: 'https://platformatic.dev/schemas/v1.26.0/db',
        db: {
          connectionString: '{PLT_HUSBAND_DATABASE_URL}',
          graphql: true,
          openapi: true,
          schemalock: true
        },
        watch: {
          ignore: [
            '*.sqlite',
            '*.sqlite-journal'
          ]
        },
        migrations: {
          dir: 'migrations',
          autoApply: '{PLT_HUSBAND_APPLY_MIGRATIONS}'
        },
        plugins: {
          paths: [
            {
              path: './plugins',
              encapsulate: false
            },
            {
              path: './routes'
            }
          ],
          typescript: '{PLT_HUSBAND_TYPESCRIPT}',
          packages: [
            {
              name: '@fastify/http-proxy',
              options: {
                upstream: '{PLT_HUSBAND_FST_PLUGIN_HTTP_PROXY_UPSTREAM}',
                prefix: '{PLT_HUSBAND_FST_PLUGIN_HTTP_PROXY_PREFIX}',
                http2: '{PLT_HUSBAND_FST_PLUGIN_HTTP_PROXY_HTTP2}'
              }
            }
          ]
        },
        types: {
          autogenerate: true
        }
      },
      env: {
        PLT_HUSBAND_DATABASE_URL: 'sqlite://./db.sqlite',
        PLT_HUSBAND_APPLY_MIGRATIONS: 'true',
        PLT_HUSBAND_TYPESCRIPT: 'true',
        PLT_HUSBAND_FST_PLUGIN_HTTP_PROXY_UPSTREAM: 'http://single-signon.example.com',
        PLT_HUSBAND_FST_PLUGIN_HTTP_PROXY_PREFIX: '/signon',
        PLT_HUSBAND_FST_PLUGIN_HTTP_PROXY_HTTP2: 'false'
      },
      template: '@platformatic/db',
      plugins: [
        {
          name: '@fastify/http-proxy',
          options: {
            upstream: '{PLT_HUSBAND_FST_PLUGIN_HTTP_PROXY_UPSTREAM}',
            prefix: '{PLT_HUSBAND_FST_PLUGIN_HTTP_PROXY_PREFIX}',
            http2: '{PLT_HUSBAND_FST_PLUGIN_HTTP_PROXY_HTTP2}'
          }
        }
      ],
      templateEnvVariables: [
        {
          var: 'DATABASE_URL',
          label: 'What is the connection string?',
          default: 'sqlite://./db.sqlite',
          type: 'string',
          configValue: 'connectionString'
        },
        {
          var: 'PLT_APPLY_MIGRATIONS',
          label: 'Should migrations be applied automatically on startup?',
          default: true,
          type: 'boolean'
        }
      ],
      pluginsDesc: [
        {
          id: '59887ba1-f758-493b-bfe9-d8b332ca1d6d',
          name: '@fastify/http-proxy',
          description: 'proxy http requests, for Fastify',
          author: 'Matteo Collina',
          homepage: 'https://github.com/fastify/fastify-http-proxy#readme',
          tags: [
            'fastify',
            'http',
            'proxy'
          ],
          latestVersion: '9.4.0',
          createdAt: '1701793068662',
          releasedAt: '1706779404000',
          downloads: 1324578,
          supportedBy: 'Fastify',
          supportedByUrl: 'https://fastify.dev',
          supportedByIcon: ' https://fastify.dev/img/logos/fastify-white.svg ',
          envVars: [
            {
              name: 'FST_PLUGIN_HTTP_PROXY_UPSTREAM',
              path: 'upstream',
              type: 'string',
              description: 'An URL (including protocol) that represents the target server to use for proxying.',
              default: 'http://single-signon.example.com'
            },
            {
              name: 'FST_PLUGIN_HTTP_PROXY_PREFIX',
              path: 'prefix',
              type: 'string',
              description: 'The prefix to mount this plugin on.',
              default: '/signon'
            },
            {
              name: 'FST_PLUGIN_HTTP_PROXY_HTTP2',
              path: 'http2',
              type: 'boolean',
              description: 'Whether to use HTTP/2 for proxying.',
              default: 'false'
            }
          ]
        }
      ],
      templateDesc: [
        {
          id: '8f3fbe51-4adc-4fdb-bdce-ec6845e2dd69',
          name: '@platformatic/db',
          description: 'Platformatic DB can expose a SQL database by dynamically mapping it to REST/OpenAPI and GraphQL endpoints. It supports a limited subset of the SQL query language, but also allows developers to add their own custom routes and resolvers,Platformatic',
          author: 'Matteo Collina',
          homepage: 'https://github.com/platformatic/platformatic#readme',
          orgId: 'platformatic',
          orgName: 'Platformatic',
          public: true,
          platformaticService: true,
          tags: [
            'Platformatic',
            'DB',
            'API'
          ],
          downloads: 972131,
          latestVersion: '1.26.0',
          createdAt: '1705329121747',
          releasedAt: '1709820227000',
          publicRequest: false,
          supportedBy: '',
          supportedByUrl: '',
          supportedByIcon: '',
          npmPackageName: '@platformatic/db'
        }
      ]
    },
    {
      id: 'putrescence',
      path: '/Users/antonio/Documents/meraki-test/db-service-test/services/putrescence',
      configPath: '/Users/antonio/Documents/meraki-test/db-service-test/services/putrescence/platformatic.json',
      config: {
        $schema: 'https://platformatic.dev/schemas/v1.26.0/service',
        service: {
          openapi: true
        },
        watch: true,
        plugins: {
          paths: [
            {
              path: './plugins',
              encapsulate: false
            },
            './routes'
          ],
          typescript: '{PLT_PUTRESCENCE_TYPESCRIPT}'
        }
      },
      env: {
        PLT_PUTRESCENCE_TYPESCRIPT: 'true'
      },
      template: '@platformatic/service',
      plugins: [],
      templateEnvVariables: [],
      pluginsDesc: [],
      templateDesc: [
        {
          id: 'a16bd72d-6ead-426c-aa27-5fc5cfc33a35',
          name: '@platformatic/service',
          description: 'A Platformatic Service is an HTTP server based on Fastify that allows developers to build robust APIs with Node.js',
          author: 'Matteo Collina',
          homepage: 'https://github.com/platformatic/platformatic#readme',
          orgId: 'platformatic',
          orgName: 'Platformatic',
          public: true,
          platformaticService: true,
          tags: [
            'Platformatic',
            'service',
            'API'
          ],
          downloads: 973510,
          latestVersion: '1.26.0',
          createdAt: '1705329121747',
          releasedAt: '1709820212000',
          publicRequest: false,
          supportedBy: '',
          supportedByUrl: '',
          supportedByIcon: '',
          npmPackageName: '@platformatic/service'
        }
      ]
    }
  ]

  const expected = [{
    name: 'husband',
    template: '@platformatic/db',
    form: {
      DATABASE_URL: {
        value: 'sqlite://./db.sqlite',
        label: 'What is the connection string?',
        var: 'DATABASE_URL'
      },
      PLT_APPLY_MIGRATIONS: {
        label: 'Should migrations be applied automatically on startup?',
        value: undefined,
        var: 'PLT_APPLY_MIGRATIONS'
      }
    },
    validForm: true,
    validations: {
      DATABASE_URLValid: true,
      PLT_APPLY_MIGRATIONSValid: true,
      formErrors: {
        DATABASE_URL: '',
        PLT_APPLY_MIGRATIONS: ''
      }
    },
    plugins: [{
      name: '@fastify/http-proxy',
      form: {
        FST_PLUGIN_HTTP_PROXY_UPSTREAM: {
          value: 'http://single-signon.example.com',
          path: 'upstream',
          description: 'An URL (including protocol) that represents the target server to use for proxying.'
        },
        FST_PLUGIN_HTTP_PROXY_PREFIX: {
          value: '/signon',
          path: 'prefix',
          description: 'The prefix to mount this plugin on.'
        },
        FST_PLUGIN_HTTP_PROXY_HTTP2: {
          value: 'false',
          path: 'http2',
          description: 'Whether to use HTTP/2 for proxying.'
        }
      },
      validForm: true,
      validations: {
        FST_PLUGIN_HTTP_PROXY_UPSTREAMValid: true,
        FST_PLUGIN_HTTP_PROXY_PREFIXValid: true,
        FST_PLUGIN_HTTP_PROXY_HTTP2Valid: true,
        formErrors: {
          FST_PLUGIN_HTTP_PROXY_UPSTREAM: '',
          FST_PLUGIN_HTTP_PROXY_PREFIX: '',
          FST_PLUGIN_HTTP_PROXY_HTTP2: ''
        }
      }
    }]
  }, {
    name: 'putrescence',
    template: '@platformatic/service',
    form: {},
    validForm: true,
    validations: {},
    plugins: []
  }]
  const result = generateFormForViewEnvironmentVariable(servicesReceived)
  expect(expected).toEqual(result)
})

test('prepareStoreForEditApplication - simple service', async () => {
  const application = {
    id: '16',
    name: 'test-3',
    path: '/Users/antonio/Documents/meraki-test/test-3',
    running: false,
    status: 'stopped',
    platformaticVersion: '1.26.0',
    isLatestPltVersion: true,
    runtime: null,
    insideMeraki: false,
    lastStarted: '2024-03-12T10:58:14.723Z',
    lastUpdated: '2024-03-12T10:58:14.723Z',
    automaticallyImported: false,
    $schema: 'https://platformatic.dev/schemas/v1.26.0/runtime',
    configPath: '/Users/antonio/Documents/meraki-test/test-3/platformatic.json',
    entrypoint: 'goatskin',
    services: [
      {
        id: 'goatskin',
        path: '/Users/antonio/Documents/meraki-test/test-3/services/goatskin',
        configPath: '/Users/antonio/Documents/meraki-test/test-3/services/goatskin/platformatic.json',
        config: {
          $schema: 'https://platformatic.dev/schemas/v1.26.0/db',
          db: {
            connectionString: '{PLT_GOATSKIN_DATABASE_URL}',
            graphql: true,
            openapi: true,
            schemalock: true
          },
          watch: {
            ignore: [
              '*.sqlite',
              '*.sqlite-journal'
            ]
          },
          migrations: {
            dir: 'migrations',
            autoApply: '{PLT_GOATSKIN_APPLY_MIGRATIONS}'
          },
          plugins: {
            paths: [
              {
                path: './plugins',
                encapsulate: false
              },
              {
                path: './routes'
              }
            ],
            typescript: '{PLT_GOATSKIN_TYPESCRIPT}'
          },
          types: {
            autogenerate: true
          }
        },
        env: {
          PLT_GOATSKIN_DATABASE_URL: 'sqlite://./db.sqlite',
          PLT_GOATSKIN_APPLY_MIGRATIONS: 'true',
          PLT_GOATSKIN_TYPESCRIPT: 'true'
        },
        template: '@platformatic/db',
        plugins: [],
        templateEnvVariables: [
          {
            var: 'DATABASE_URL',
            label: 'What is the connection string?',
            default: 'sqlite://./db.sqlite',
            type: 'string',
            configValue: 'connectionString'
          },
          {
            var: 'PLT_APPLY_MIGRATIONS',
            label: 'Should migrations be applied automatically on startup?',
            default: true,
            type: 'boolean'
          }
        ],
        pluginsDesc: [],
        templateDesc: [
          {
            id: '8f3fbe51-4adc-4fdb-bdce-ec6845e2dd69',
            name: '@platformatic/db',
            description: 'Platformatic DB can expose a SQL database by dynamically mapping it to REST/OpenAPI and GraphQL endpoints. It supports a limited subset of the SQL query language, but also allows developers to add their own custom routes and resolvers,Platformatic',
            author: 'Matteo Collina',
            homepage: 'https://github.com/platformatic/platformatic#readme',
            orgId: 'platformatic',
            orgName: 'Platformatic',
            public: true,
            platformaticService: true,
            tags: [
              'Platformatic',
              'DB',
              'API'
            ],
            downloads: 980663,
            latestVersion: '1.26.0',
            createdAt: '1705329121747',
            releasedAt: '1709820227000',
            publicRequest: false,
            supportedBy: '',
            supportedByUrl: '',
            supportedByIcon: '',
            npmPackageName: '@platformatic/db'
          }
        ]
      }
    ]
  }

  const expected = {
    formData: {
      createApplication: {
        application: 'test-3',
        path: '/Users/antonio/Documents/meraki-test/test-3'
      }
    },
    services: [{
      name: 'goatskin',
      renameDisabled: true,
      template: {
        name: '@platformatic/db',
        disabled: true
      },
      plugins: []
    }]
  }

  expect(expected).toEqual(prepareStoreForEditApplication(application))
})
