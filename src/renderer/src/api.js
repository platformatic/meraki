export const getApiTemplates = async () => {
  return await window.api.getTemplates()
}

export const getApiPlugins = async () => {
  return await window.api.getPlugins()
}

export const callPrepareFolder = async (path, templates) => {
  return await window.api.prepareFolder(path, templates)
}

export const logInfo = callback => window.api.onLog(callback)
