"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "../../resources/icon.png");
const isMac = process.platform === "darwin";
const template = [
  // { role: 'appMenu' }
  ...isMac ? [{
    label: electron.app.name,
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "services" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" }
    ]
  }] : [],
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [
      isMac ? { role: "close" } : { role: "quit" }
    ]
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...isMac ? [
        { type: "separator" },
        { role: "front" },
        { type: "separator" },
        { role: "window" }
      ] : [
        { role: "close" }
      ]
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://platformatic.dev");
        }
      }
    ]
  }
];
const setupMenu = () => {
  const menu = electron.Menu.buildFromTemplate(template);
  electron.Menu.setApplicationMenu(menu);
};
const nameList = [
  "Time - Past - Future - Dev",
  "Fly - Flying - Soar - Soaring",
  "Power - Falling",
  "Sharp - Dead - Mew - Chuckle - Bubba",
  "Time",
  "Past",
  "Future",
  "Dev",
  "Fly",
  "Flying",
  "Soar",
  "Soaring",
  "Power",
  "Falling",
  "Legacy",
  "Sharp",
  "Dead",
  "Mew",
  "Chuckle",
  "Bubba",
  "Bubble",
  "Sandwich",
  "Smasher - Extreme - Multi",
  "Smasher",
  "Extreme",
  "Multi",
  "Universe",
  "Ultimate",
  "Death",
  "Ready - Monkey",
  "Ready",
  "Monkey",
  "Paradox"
];
const envList = [
  "MENDACITY",
  "PEDANTIC",
  "MELLIFLUOUS",
  "TREPIDATION",
  "EXTENUATE",
  "IMPERTURBABLE",
  "HIRSUTE",
  "PERISH",
  "RECITALS",
  "SUPERCILIOUS",
  "AIL",
  "PERPETRATE"
];
const getTemplates = async () => {
  const howMany = Math.floor(Math.random() * (nameList.length - 10));
  const nameArray = ["Platformatic service"];
  let name;
  while (nameArray.length < howMany) {
    name = nameList[Math.floor(Math.random() * nameList.length)];
    if (!nameArray.includes(name)) {
      nameArray.push(name);
    }
  }
  return nameArray.map((name2, index) => ({
    id: index + 1,
    name: name2,
    platformaticService: index === 0,
    env: Array.from(new Array(Math.floor(Math.random() * envList.length)).keys()).map(() => envList[Math.floor(Math.random() * envList.length)])
  }));
};
const getPlugins = async () => {
  const howMany = Math.floor(Math.random() * (nameList.length - 10));
  const nameArray = [];
  let name;
  while (nameArray.length < howMany) {
    name = nameList[Math.floor(Math.random() * nameList.length)];
    if (!nameArray.includes(name)) {
      nameArray.push(name);
    }
  }
  return nameArray.map((name2, index) => ({
    id: index + 1,
    name: name2
  }));
};
const {
  setTimeout
} = require("node:timers/promises");
const prepareFolder = async (path2, logger) => {
  logger.info("Preparing folder");
  await setTimeout(3e3);
  logger.info("Folder prepared");
};
const createApp = async (path2, logger) => {
  logger.info("Creating app");
  await setTimeout(1e3);
  logger.info("first step");
  await setTimeout(1e3);
  logger.info("second step");
  await setTimeout(1e3);
  logger.info("App created!");
};
process.platform === "darwin";
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    minWidth: 1024,
    minHeight: 768,
    show: false,
    autoHideMenuBar: false,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  setupMenu();
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
  electron.ipcMain.handle("select-folder", async (event) => {
    const result = await electron.dialog.showOpenDialog({ properties: ["openDirectory"] });
    if (result.canceled) {
      return null;
    } else {
      return result.filePaths[0];
    }
  });
  electron.ipcMain.handle("get-templates", async () => {
    return getTemplates();
  });
  electron.ipcMain.handle("get-plugins", async () => {
    return getPlugins();
  });
  electron.ipcMain.handle("prepare-folder", async (_, path2) => {
    return prepareFolder();
  });
  electron.ipcMain.handle("create-app", async (_, path2) => {
    return createApp();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
