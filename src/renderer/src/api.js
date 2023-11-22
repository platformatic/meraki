import { getTemplates, getPlugins } from '~/../../../__mocks__/api'

const mockUse = import.meta.env.RENDERER_VITE_USE_MOCKS === 'true'

export const getApiTemplates = async () => {
  if (mockUse) {
    return await getTemplates()
  }
  return await window.api.getTemplates()
}

export const getApiPlugins = async () => {
  if (mockUse) {
    return await getPlugins()
  }
  return await window.api.getPlugins()
}
