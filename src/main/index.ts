import fs from "fs";
import path from "path";
import os from "os";
import util from "util";
import { app, BrowserWindow, dialog, ipcMain, session } from "electron";
import electronIsDev from "electron-is-dev";

async function loadReactDevTools() {
  console.log("loading react dev tools.");
  const versions = path.join(
    os.homedir(),
    "/Library/Application\ Support/BraveSoftware/Brave-Browser/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi"
  );;

  const files = await util.promisify(fs.readdir)(versions);
  const version = files.reduce((a, b) => a > b ? a : b);

  const reactDevToolsPath = path.join(versions, version);
  await session.defaultSession.loadExtension(reactDevToolsPath);
}

let mainWindow: BrowserWindow;
app.whenReady().then(async () => {
  if (electronIsDev) {
    await loadReactDevTools()
    // setTimeout(() => loadReactDevTools(), 5000);
  }

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 300,
    minHeight: 300,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  const url = (() => {
    if (electronIsDev && !process.env.USE_BUILD) {
      const port = process.env.PORT || 3000;
      return `http://localhost:${port}`;
    } else {
      return `file://${path.join(__dirname, "../renderer/index.html")}`
    }
  })();

  mainWindow.loadURL(url);
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
});

ipcMain.on("openFile", async (event) => {
    const filePath = await openFile()
    event.reply("openFile", filePath)
})

async function openFile() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile", "openDirectory"]
  })

  if (!result.canceled && 1 == result.filePaths.length) {
    const filePath = result.filePaths[0];
    const data = await fs.promises.readFile(filePath, "utf-8")
    // Parse file and stash date to be saved when list is created.
    return filePath;
  }
}
