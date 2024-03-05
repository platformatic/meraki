import getSqlMapper from './db.mjs'

class Applications {
  #mapper
  #entities
  constructor (mapper) {
    this.#mapper = mapper
    this.#entities = mapper.entities
  }

  async getApplications () {
    return this.#entities.application.find({})
  }

  async addApplication ({ name, path }) {
    return this.#entities.application.save({
      fields: ['name', 'path'],
      input: { name, path }
    })
  }

  async deleteApplication (id) {
    return this.#entities.application.delete({ where: { id: { eq: id } } })
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
    return new Applications(mapper)
  }
}

export default Applications
