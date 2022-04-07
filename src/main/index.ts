import fs from "fs";
import path from "path";
import os from "os";
import util from "util";
import process from "process";

import { app, BrowserWindow, session } from "electron";
import electronIsDev from "electron-is-dev";

import api from "./api.js";

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

const copyStarterDB = async (dbFile: string) => {
  console.debug(`Database file: ${dbFile}`);

  try {
    await fs.promises.stat(dbFile);
  } catch(error) {
    const source = path.join(process.cwd(), "Brickhunt.sqlite");
    await fs.promises.copyFile(source, dbFile);
  }
}

let mainWindow: BrowserWindow;
app.whenReady().then(async () => {
  const dbFile = path.join(app.getPath('userData'), "brickhunt.sqlite");

  copyStarterDB(dbFile);

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
      contextIsolation: false
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

  // Setup ipcHandlers for "API"
  api(mainWindow, dbFile);
});
