import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  const devMode = process.argv.filter((arg) => arg.startsWith('--devMode='))[0]?.split('=')?.[1]

  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('dialog', {
    showDialog: () => (ipcRenderer.invoke('select-folder'))
  })

  contextBridge.exposeInMainWorld('appInfo', {
    isDevMode: devMode === 'true'
  })

  contextBridge.exposeInMainWorld('api', {
    getTemplates: () => (ipcRenderer.invoke('get-templates')),
    getPlugins: () => (ipcRenderer.invoke('get-plugins')),
    prepareFolder: (folder, templates, appName) => (ipcRenderer.invoke('prepare-folder', folder, templates, appName)),
    onLog: callback => ipcRenderer.on('log', callback),
    removeLog: () => ipcRenderer.removeAllListeners('log'),
    quitApp: () => (ipcRenderer.invoke('quit-app')),
    getServiceName: () => (ipcRenderer.invoke('generate-name')),
    onUserStatus: callback => ipcRenderer.on('user-status', callback),

    // Applications
    createApp: (folder, project) => (ipcRenderer.invoke('create-app', folder, project)),
    getApplications: () => (ipcRenderer.invoke('get-applications')),
    getApplication: (id) => (ipcRenderer.invoke('get-application', id)),
    importApp: (path, folderName) => (ipcRenderer.invoke('import-app', path, folderName)),
    deleteApp: (id) => (ipcRenderer.invoke('delete-app', id)),
    startApp: (id) => (ipcRenderer.invoke('start-app', id)),
    stopApp: (id) => (ipcRenderer.invoke('stop-app', id)),
    openApp: (id) => (ipcRenderer.invoke('open-app', id)),
    updateApp: (id, folder, project) => (ipcRenderer.invoke('update-app', id, folder, project)),
    upgradeAppPlt: (id) => (ipcRenderer.invoke('upgrade-app-plt', id)),

    // logs
    startLogs: (id) => (ipcRenderer.invoke('start-logs', id)),
    onAppLog: callback => ipcRenderer.on('app-logs', callback),
    pauseLogs: () => (ipcRenderer.invoke('pause-logs')),
    resumeLogs: () => (ipcRenderer.invoke('resume-logs')),
    stopLogs: () => {
      ipcRenderer.removeAllListeners('app-logs')
      return ipcRenderer.invoke('stop-logs')
    },
    getPreviousLogs: (id) => (ipcRenderer.invoke('get-previous-logs', id)),
    getAllLogs: (id) => (ipcRenderer.invoke('get-all-logs', id)),
    thereArePreviousLogs: (id) => (ipcRenderer.invoke('there-are-prev-logs')),

    // metrics
    startMetrics: (id) => (ipcRenderer.invoke('start-metrics', id)),
    onAppMetrics: (id, callback) => (ipcRenderer.on('app-metrics', id, callback)),
    stopMetrics: () => {
      ipcRenderer.removeAllListeners('app-metrics')
      return ipcRenderer.invoke('stop-metrics')
    },

    // template-id
    receivedTemplateID: callback => ipcRenderer.on('use-template-id', callback),
    stopReceivingTemplateID: callback => ipcRenderer.removeAllListeners('use-template-id', callback),

    // proxy
    startProxy: (id, serviceId) => (ipcRenderer.invoke('start-proxy', id, serviceId)),
    stopProxy: () => (ipcRenderer.invoke('stop-proxy'))
  })
} else {
  window.electron = electronAPI
  window.api = api
}
