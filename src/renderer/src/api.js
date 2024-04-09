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

export const callUpdateApp = async (id, path, project) => {
  return await window.api.updateApp(id, path, project)
}

export const callUpgradeAppPlt = async (id) => {
  return await window.api.upgradeAppPlt(id)
}

export const callImportApp = async (path, folderName) => {
  return await window.api.importApp(path, folderName)
}

export const getApiApplications = async (path) => {
  return await window.api.getApplications(path)
}

export const callStartApplication = async (id) => {
  await window.api.startApp(id)
  return await window.api.openApp(id)
}

export const callStopApplication = async (id) => {
  await window.api.stopApp(id)
  return await window.api.openApp(id)
}

export const callDeleteApplication = async (id) => {
  return await window.api.deleteApp(id)
}

export const callOpenApplication = async (id) => {
  return await window.api.openApp(id)
}

export const logInfo = callback => window.api.onLog(callback)
export const removeLogInfo = () => window.api.removeLog()

export const registerUserStatusListener = callback => window.api.onUserStatus(callback)

export const quitApp = () => window.api.quitApp()

export const callApiStartLogs = async (id) => {
  return await window.api.startLogs(id)
}
export const getAppLogs = callback => window.api.onAppLog(callback)

export const callApiPauseLogs = async () => {
  return await window.api.pauseLogs()
}

export const callApiGetAllLogs = async (id) => {
  return await window.api.getAllLogs(id)
}

export const callThereArePreviousLogs = async () => {
  return await window.api.thereArePreviousLogs()
}

export const callApiResumeLogs = async () => {
  return await window.api.resumeLogs()
}

export const callApiStopLogs = async () => {
  return await window.api.stopLogs()
}

export const callApiGetPreviousLogs = async (id) => {
  return await window.api.getPreviousLogs(id)
}

// Metrics ****************************/
export const callApiStartMetrics = async (id) => {
  return await window.api.startMetrics(id)
}

export const getAppMetrics = (id, callback) => window.api.onAppMetrics(callback)

export const callApiStopMetrics = async () => {
  return await window.api.stopMetrics()
}

export const onReceivedTemplateId = (callback) => window.api.receivedTemplateID(callback)
export const onStopReceivingTemplateId = (callback) => window.api.stopReceivingTemplateID(callback)

export const startProxy = async (id, serviceId) => {
  return window.api.startProxy(id, serviceId)
}

export const stopProxy = async () => {
  return await window.api.stopProxy()
}
