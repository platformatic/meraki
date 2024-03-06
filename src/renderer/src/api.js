export const getApiTemplates = async () => {
  return await window.api.getTemplates()
}

export const getApiPlugins = async () => {
  return await window.api.getPlugins()
}

export const callPrepareFolder = async (path, templates, application) => {
  return await window.api.prepareFolder(path, templates, application)
}

export const callCreateApp = async (path, project) => {
  return await window.api.createApp(path, project)
}

export const callImportApp = async (path, folderName) => {
  return await window.api.importApp(path, folderName)
}

export const getApiApplications = async (path) => {
  return await window.api.getApplications(path)
}

export const callStartApplication = async (id) => {
  return await window.api.startApp(id)
}

export const callStopApplication = async (id) => {
  return await window.api.stopApp(id)
}

export const callDeleteApplication = async (id) => {
  return await window.api.deleteApp(id)
}

export const logInfo = callback => window.api.onLog(callback)
export const registerUserStatusListener = callback => window.api.onUserStatus(callback)

export const quitApp = () => window.api.quitApp()
