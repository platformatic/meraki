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

  static async getApplications (appPath, configFolder) {
    const mapper = await getSqlMapper(appPath, configFolder)
    return new Applications(mapper)
  }
}

export default Applications
