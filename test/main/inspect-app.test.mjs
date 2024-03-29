import { test, expect, onTestFinished } from 'vitest'
import { mkdtemp, cp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { startMarketplace, setUpEnvironment } from './helper.mjs'
import { npmInstall } from '../../src/main/lib/run-npm.mjs'

const logger = {
  debug: console.log,
  info: console.log
}

// We need to setup env BEFORE importing the module
setUpEnvironment()
const { inspectApp } = await import('../../src/main/lib/inspect-app.mjs')

test('inspect runtime generated by meraki', async () => {
  const envVars1 = [{
    name: 'TEST',
    path: '/test',
    type: 'string'
  }, {
    name: 'TEST2',
    path: '/test2',
    type: 'number'
  }]

  const plugs = [
    {
      id: 1,
      name: '@fastify/static',
      description: 'plugin1 description',
      envVars: envVars1
    }
  ]

  const stacks = [
    {
      id: 1,
      orgName: 'org1',
      name: '@platformatic/db',
      description: 'stackable1 description',
      public: true
    },
    {
      id: 2,
      orgName: 'org2',
      name: '@platformatic/service',
      description: 'stackable2 description',
      public: true
    }
  ]
  await startMarketplace({
    getPluginsCallback: (request, reply) => {
      reply.code(200).send(plugs)
    },

    getStackablesCallback: (request, reply) => {
      reply.code(200).send(stacks)
    }
  })

  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  onTestFinished(() => rm(appDir, { recursive: true, force: true }))
  const appFixture = join('test', 'fixtures', 'app')
  await cp(appFixture, appDir, { recursive: true })

  await npmInstall(null, { cwd: appDir }, logger)

  const runtimeDesc = await inspectApp(appDir)

  const expected = {
    $schema: 'https://platformatic.dev/schemas/v1.23.0/runtime',
    configPath: `${appDir}/platformatic.json`,
    entrypoint: 'main',
    path: appDir,
    loggerLevel: 'debug',
    port: 3042,
    services: [
      {
        id: 'main',
        path: `${appDir}/services/main`,
        configPath: `${appDir}/services/main/platformatic.json`,
        config: {
          $schema: 'https://platformatic.dev/schemas/v1.23.0/composer',
          composer: {
            services: [
              {
                id: 'my-service',
                openapi: {
                  url: '/documentation/json',
                  prefix: '/my-service'
                }
              },
              {
                id: 'my-db',
                openapi: {
                  url: '/documentation/json',
                  prefix: '/my-db'
                }
              }
            ],
            refreshTimeout: 1000
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
            typescript: '{PLT_MAIN_TYPESCRIPT}',
            packages: [
              {
                name: '@fastify/static',
                options: {
                  root: '{PLT_ROOT}/{PLT_MAIN_FST_PLUGIN_STATIC_ROOT}',
                  prefix: '{PLT_MAIN_FST_PLUGIN_STATIC_PREFIX}',
                  schemaHide: '{PLT_MAIN_FST_PLUGIN_STATIC_SCHEMA_HIDE}'
                }
              }
            ]
          }
        },
        env: {
          PLT_MAIN_TYPESCRIPT: 'true',
          PLT_MAIN_EXAMPLE_ORIGIN: 'http://127.0.0.1:3043',
          PLT_MAIN_FST_PLUGIN_STATIC_ROOT: 'static',
          PLT_MAIN_FST_PLUGIN_STATIC_PREFIX: '/ui',
          PLT_MAIN_FST_PLUGIN_STATIC_SCHEMA_HIDE: 'true'
        },

        plugins: [
          {
            name: '@fastify/static',
            options: {
              root: '{PLT_ROOT}/{PLT_MAIN_FST_PLUGIN_STATIC_ROOT}',
              prefix: '{PLT_MAIN_FST_PLUGIN_STATIC_PREFIX}',
              schemaHide: '{PLT_MAIN_FST_PLUGIN_STATIC_SCHEMA_HIDE}'
            }
          }
        ],
        template: '@platformatic/composer',
        templateEnvVariables: [],
        pluginsDesc: [
          {
            id: 1,
            name: '@fastify/static',
            description: 'plugin1 description',
            envVars: [
              {
                name: 'TEST',
                path: '/test',
                type: 'string'
              },
              {
                name: 'TEST2',
                path: '/test2',
                type: 'number'
              }
            ]
          }
        ],
        templateDesc: []
      },
      {
        id: 'my-db',
        path: `${appDir}/services/my-db`,
        configPath: `${appDir}/services/my-db/platformatic.json`,
        config: {
          $schema: 'https://platformatic.dev/schemas/v1.23.0/db',
          db: {
            connectionString: '{PLT_MY_DB_DATABASE_URL}',
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
            autoApply: '{PLT_MY_DB_APPLY_MIGRATIONS}'
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
            typescript: '{PLT_MY_DB_TYPESCRIPT}'
          },
          types: {
            autogenerate: true
          }
        },
        env: {
          PLT_MY_DB_DATABASE_URL: 'sqlite://./db.sqlite',
          PLT_MY_DB_APPLY_MIGRATIONS: 'true',
          PLT_MY_DB_TYPESCRIPT: 'true'
        },
        templateEnvVariables: [{
          configValue: 'connectionString',
          default: 'sqlite://./db.sqlite',
          label: 'What is the connection string?',
          type: 'string',
          var: 'DATABASE_URL'
        }, {
          default: true,
          label: 'Should migrations be applied automatically on startup?',
          type: 'boolean',
          var: 'PLT_APPLY_MIGRATIONS'
        }
        ],
        template: '@platformatic/db',
        plugins: [],
        pluginsDesc: [],
        templateDesc: [
          {
            id: 1,
            orgName: 'org1',
            name: '@platformatic/db',
            description: 'stackable1 description',
            public: true
          }
        ]
      },
      {
        id: 'my-service',
        path: `${appDir}/services/my-service`,
        configPath: `${appDir}/services/my-service/platformatic.json`,
        config: {
          $schema: 'https://platformatic.dev/schemas/v1.23.0/service',
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
            typescript: '{PLT_MY_SERVICE_TYPESCRIPT}'
          }
        },
        env: {
          PLT_MY_SERVICE_TYPESCRIPT: 'true'
        },
        template: '@platformatic/service',
        templateEnvVariables: [],
        plugins: [],
        pluginsDesc: [],
        templateDesc: [
          {
            id: 2,
            orgName: 'org2',
            name: '@platformatic/service',
            description: 'stackable2 description',
            public: true
          }
        ]
      }
    ]
  }
  delete runtimeDesc.config // it's redudnant and too big to compare

  expect(runtimeDesc).toEqual(expected)
  rm(appDir, { recursive: true, force: true })
}, 20000)

test('inspect runtime generated by meraki with stackable', async () => {
  await startMarketplace({
    getPluginsCallback: (request, reply) => {
      reply.code(200).send([])
    },

    getStackablesCallback: (request, reply) => {
      reply.code(200).send([])
    }
  })

  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  onTestFinished(() => rm(appDir, { recursive: true, force: true }))
  const appFixture = join('test', 'fixtures', 'app-stackable')
  await cp(appFixture, appDir, { recursive: true })

  await npmInstall(null, { cwd: appDir }, logger)

  const runtimeDesc = await inspectApp(appDir)

  const expected =
  {
    $schema: 'https://platformatic.dev/schemas/v1.23.0/runtime',
    configPath: `${appDir}/platformatic.json`,
    entrypoint: 'zephyr',
    loggerLevel: 'debug',
    port: 3042,
    path: appDir,
    services: [
      {
        id: 'zephyr',
        path: `${appDir}/services/zephyr`,
        configPath: `${appDir}/services/zephyr/platformatic.json`,
        config: {
          $schema: './stackable.schema.json',
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
            typescript: '{PLT_ZEPHYR_TYPESCRIPT}'
          },
          module: 'stackable-example',
          greeting: {
            text: '{PLT_GREETING_TEXT}'
          }
        },
        env: {
          PLT_ZEPHYR_GREETING_TEXT: 'Hello world!',
          PLT_ZEPHYR_TYPESCRIPT: 'false'
        },
        template: 'stackable-example',
        templateEnvVariables: [{
          default: 'Hello world!',
          label: 'What should the stackable greeting say?',
          type: 'string',
          var: 'PLT_GREETING_TEXT'
        }
        ],
        plugins: [],
        pluginsDesc: [],
        templateDesc: []
      }
    ]
  }

  delete runtimeDesc.config // it's redudnant and too big to compare
  expect(runtimeDesc).toEqual(expected)
  rm(appDir, { recursive: true, force: true })
}, 20000)
