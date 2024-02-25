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
      importApp: (folder, appName) => (ipcRenderer.invoke('import-app', folder, appName)),
      getApplications: (folder) => (ipcRenderer.invoke('get-applications', folder)),
      quitApp: () => (ipcRenderer.invoke('quit-app')),
      getServiceName: () => (ipcRenderer.invoke('generate-name')),
      onUserStatus: callback => ipcRenderer.on('user-status', callback)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
