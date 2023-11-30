import mockedPlugins from './plugins.json'
import mockedTemplates from './templates.json'
import mockedEnvList from './envlist.json'
import mockedVars from './pluginvars.json'

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getTemplates = async () => {
  return mockedTemplates.map(template => ({
    ...template
    // venvVars: Array.from(new Array(getRandomInt(1, mockedEnvList.length)).keys()).map(() => mockedEnvList[Math.floor(Math.random() * mockedEnvList.length)])
  }))
}

export const getPlugins = async () => {
  return mockedPlugins.map(plugin => ({
    ...plugin,
    envVars: [...mockedVars]
  }))
}

export const prepareFolder = async (_path, templates) => {
  const pro = new Promise((resolve) => {
    setTimeout(() => {
      const ret = {}
      templates.forEach(template => {
        ret[`${template}`] = Array.from(new Array(getRandomInt(1, mockedEnvList.length)).keys()).map(() => mockedEnvList[Math.floor(Math.random() * mockedEnvList.length)])
      })
      return resolve(ret)
    }, 2000)
  })
  return pro
}
