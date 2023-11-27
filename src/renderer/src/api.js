import { getTemplates, getPlugins } from '~/../../../__mocks__/api'

export const getApiTemplates = async () => {
  return await window.api.getTemplates()
}

export const getApiPlugins = async () => {
  return await window.api.getPlugins()
}
