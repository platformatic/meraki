import { connect } from '@platformatic/sql-mapper'
import { join, resolve } from 'node:path'
import log from 'electron-log'
log.addLevel('trace')

const getConnectionString = (dbFolder) => {
  // This is for tests
  if (process.env.MERAKI_DB_CONNECTION_STRING) {
    return process.env.MERAKI_DB_CONNECTION_STRING
  }
  const dbPath = join(dbFolder, 'meraki.sqlite')
  return `sqlite://${dbPath}`
}

const getSqlMapper = async (merakiFolder, merakiConfigFolder) => {
  const connectionString = getConnectionString(merakiConfigFolder)

  // When the DB is ready, try to apply the migrations
  async function onDatabaseLoad (db, sql) {
    try {
      const Postgrator = (await import('postgrator')).default
      const migrationPattern = resolve(join(merakiFolder, 'migrations', '*'))
      log.info('Migrations:', migrationPattern)
      const postgrator = new Postgrator({
        driver: 'sqlite3',
        migrationPattern,
        execQuery: async (query) => {
          const res = await db.query(sql`${sql.__dangerous__rawValue(query)}`)
          return { rows: res }
        },
        databaseUrl: connectionString,
        schemaTable: 'versions',
        validateChecksums: true,
        validateMigrations: true,
        log
      })

      postgrator.on('migration-started', (migration) => {
        log.info('Migration started', JSON.stringify(migration))
      })

      postgrator.on('migration-finished', (migration) => {
        log.info('Migration applied', JSON.stringify(migration))
      })
      await postgrator.migrate()
    } catch (error) {
      log.error('Error migrating database', error)
    }
  }

  const mapper = await connect({
    connectionString,
    log,
    onDatabaseLoad,
    cache: true
  })
  return mapper
}

export default getSqlMapper
