import mockedPlugins from './plugins.json'
import mockedTemplates from './templates.json'

const envList = [
  'MENDACITY',
  'PEDANTIC',
  'MELLIFLUOUS',
  'TREPIDATION',
  'EXTENUATE',
  'IMPERTURBABLE',
  'HIRSUTE',
  'PERISH',
  'RECITALS',
  'SUPERCILIOUS',
  'AIL',
  'PERPETRATE'
]

export const getTemplates = async () => mockedTemplates

export const getPlugins = async () => {
  return mockedPlugins.map(plugin => ({
    ...plugin,
    envVars: Array.from(new Array(Math.floor(Math.random() * envList.length)).keys()).map(() => envList[Math.floor(Math.random() * envList.length)])
  }))
}
