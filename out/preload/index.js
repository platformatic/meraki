"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("dialog", {
      showDialog: () => electron.ipcRenderer.invoke("select-folder")
    });
    electron.contextBridge.exposeInMainWorld("api", {
      getTemplates: () => electron.ipcRenderer.invoke("get-templates"),
      getPlugins: () => electron.ipcRenderer.invoke("get-plugins")
    });
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
