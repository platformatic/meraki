import mockedPlugins from '../../__mocks__/plugins.json'
import mockedTemplates from '../../__mocks__/templates.json'
import mockedEnvList from '../../__mocks__/envlist.json'
import mockedVars from '../../__mocks__/pluginvars.json'

// TODO: replace with the actual calls
export const getTemplates = async () => {
  return mockedTemplates.map(template => ({
    ...template,
    envVars: Array.from(new Array(Math.floor(Math.random() * mockedEnvList.length)).keys()).map(() => mockedEnvList[Math.floor(Math.random() * mockedEnvList.length)])
  }))
}

// TODO: replace with the actual calls
export const getPlugins = async () => {
  return mockedPlugins.map(plugin => ({
    ...plugin,
    envVars: [...mockedVars]
  }))
}
