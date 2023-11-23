import mockedPlugins from './plugins.json'
import mockedTemplates from './templates.json'
import mockedEnvList from './envlist.json'
import mockedVars from './pluginvars.json'

export const getTemplates = async () => {
  return mockedTemplates.map(template => ({
    ...template,
    envVars: Array.from(new Array(Math.floor(Math.random() * mockedEnvList.length)).keys()).map(() => mockedEnvList[Math.floor(Math.random() * mockedEnvList.length)])
  }))
}

export const getPlugins = async () => {
  return mockedPlugins.map(plugin => ({
    ...plugin,
    vars: [...mockedVars]
  }))
}
