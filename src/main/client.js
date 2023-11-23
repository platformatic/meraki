import mockedPlugins from '../../__mocks__/plugins.json'
import mockedTemplates from '../../__mocks__/templates.json'

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

// TODO: replace with the actual calls
export const getTemplates = async () => mockedTemplates

// TODO: replace with the actual calls
export const getPlugins = async () => {
  return mockedPlugins.map(mockedPlugin => ({
    ...mockedPlugin,
    envVars: Array.from(new Array(Math.floor(Math.random() * envList.length)).keys()).map(() => envList[Math.floor(Math.random() * envList.length)])
  }))
}
