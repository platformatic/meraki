import getSqlMapper from './db.mjs'

class Applications {
  constructor (mapper) {
    this.mapper = mapper
    this.entities = mapper.entities
  }

  static async getApplications (appPath, configFolder) {
    console.log('appPath', appPath)
    const mapper = await getSqlMapper(appPath, configFolder)
    return new Applications(mapper)
  }

  async getApplications () {
    return this.entities.application.find({})
  }

  async addApplication ({ name, path }) {
    return this.entities.application.save({
      fields: ['name', 'path'],
      input: { name, path }
    })
  }

  async deleteApplication (id) {
    return this.entities.application.delete({ where: { id: { eq: id } } })
  }
}

export default Applications
