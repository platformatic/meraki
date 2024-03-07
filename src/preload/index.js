import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('dialog', {
      showDialog: () => (ipcRenderer.invoke('select-folder'))
    })

    contextBridge.exposeInMainWorld('api', {
      getTemplates: () => (ipcRenderer.invoke('get-templates')),
      getPlugins: () => (ipcRenderer.invoke('get-plugins')),
      prepareFolder: (folder, templates, appName) => (ipcRenderer.invoke('prepare-folder', folder, templates, appName)),
      onLog: callback => ipcRenderer.on('log', callback),
      createApp: (folder, project) => (ipcRenderer.invoke('create-app', folder, project)),
      quitApp: () => (ipcRenderer.invoke('quit-app')),
      getServiceName: () => (ipcRenderer.invoke('generate-name')),
      onUserStatus: callback => ipcRenderer.on('user-status', callback),

      // Applications
      getApplications: () => (ipcRenderer.invoke('get-applications')),
      importApp: (path, folderName) => (ipcRenderer.invoke('import-app', path, folderName)),
      deleteApp: (id) => (ipcRenderer.invoke('delete-app', id)),
      startApp: (id) => (ipcRenderer.invoke('start-app', id)),
      stopApp: (id) => (ipcRenderer.invoke('stop-app', id)),

      // logs
      startLogs: (id) => (ipcRenderer.invoke('start-logs', id)),
      onAppLog: callback => ipcRenderer.on('app-logs', callback),
      pauseLogs: () => (ipcRenderer.invoke('pause-logs')),
      resumeLogs: () => (ipcRenderer.invoke('resume-logs')),
      stopLogs: () => (ipcRenderer.invoke('stop-logs')),
      getAllLogs: () => (ipcRenderer.invoke('get-all-logs'))
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
