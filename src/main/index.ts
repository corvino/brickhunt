import fs from "fs";
import path from "path";
import os from "os";
import util from "util";
import process from "process";
import { app, BrowserWindow, dialog, ipcMain, MenuItem, session } from "electron";
import electronIsDev from "electron-is-dev";
import {Connection, createConnection, Repository, ConnectionManager} from "typeorm";
import xml2js from "xml2js";

import * as entities from "./entity";

let buildItems: entities.BuildItem[];

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
  const dbFile = path.join(app.getPath('userData'), 'brickhunt.sqlite');
  console.debug(`Database file: ${dbFile}`);

  try {
    await fs.promises.stat(dbFile);
  } catch(error) {
    const source = path.join(process.cwd(), 'Brickhunt.sqlite');
    await fs.promises.copyFile(source, dbFile);
  }

  await (async () => {
    await createConnection({
      type: "sqlite",
      database: dbFile,
      entities: entities.All,
      // FIXME: This is for dev; replace with a more robust solution.
      // https://typeorm.io/#/connection-options/common-connection-options
      synchronize: true
    });
  })();

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
});

ipcMain.on("buildList", async (event) => {
  const builds = await entities.Build.find();


  event.reply("builds", builds);
});

ipcMain.on("build", async (event, arg) => {
  const builds = await entities.Build.find({ where: { id: arg }, relations: ["items", "items.partColor", "items.partColor.color", "items.partColor.part"]});
  const build = builds[0];

  console.log("build");
  event.reply("build", build);
});

ipcMain.on("openFile", async (event) => {
    const filePath = await openFile();
    event.reply("openFile", filePath);
});

ipcMain.on("createBuild", async (event, arg) => {
  const build = new entities.Build();
  build.name = arg.name;
  build.items = buildItems;

  await build.save();

  event.reply("buildCreated");
});

function nameToLowerCase(name){
  return name.toLowerCase();
}

async function openFile() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile", "openDirectory"]
  });

  if (!result.canceled && 1 == result.filePaths.length) {
    const filePath = result.filePaths[0];
    const xmlOptions = {
      tagNameProcessors: [nameToLowerCase],
      attrNameProcessors: [nameToLowerCase]
    };
    const data = await fs.promises.readFile(filePath, "utf-8");
    try {
      const items = await xml2js.parseStringPromise(data, xmlOptions);
      buildItems = <entities.BuildItem[]> (await Promise.all(items.inventory.item.map(async (item) => {
        // console.log(item);
        const partColor = await entities.PartColor.find({
          relations: ["color", "part"],
          where: {
            color: { bricklinkId: parseInt(item.color) },
            part: { bricklinkId: parseInt(item.itemid) }
          }
        });

        // If we have an unusual result from the find, log something.
        // We haven't fixed all parts yet, only those available from Pick a Brick.
        if (1 !== partColor.length) {
          console.log(`designId: ${parseInt(item.itemid)}, color: ${parseInt(item.color)}, results: ${partColor.length}`);
          for (const part of partColor) {
            console.log(`  ${part.part.name}, ${part.part.designId} (${part.part.bricklinkId}), ${part.color.name}, ${part.color.id} (${part.color.bricklinkId})`);
          }

          return null;
        }

        const buildItem = new entities.BuildItem();
        buildItem.partColor = partColor[0];
        buildItem.quantity = item.minqty;

        return buildItem;
      }))).filter(x => x);
    } catch (error) {
      console.log(error);
    }
    return filePath;
  }
}

ipcMain.on("parts", async (event) => {
  const parts = (await entities.Part.find());

  event.reply("parts", parts);
});
