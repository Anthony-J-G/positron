import { app, shell, session, ipcMain, dialog, globalShortcut } from "electron";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import { ElectronProcess, ConfigTypeFlags, SourceTypeFlags } from "./setup";
import { LaunchPython } from "./python";
import { getDemoTable, openDatabase } from "./sql";



// const TEST_ADDON = require("../../build/Release/test_binding");
const CONFIGURATION: ConfigTypeFlags = ConfigTypeFlags.Release;



const angularBrowserOptions = { 
  icon: path.join(
    process.cwd(), 'Source/Angular/favicon.ico'
  ),
  // titleBarStyle: 'hidden',
  title: 'Positron Template Project', 
  opacity: 1.00, 
  backgroundColor: '#965BAE',
  minWidth: 880, 
  minHeight: 680, 
  width: 961,
  height: 888,
  show: false, 
  webPreferences: { 
    preload: path.join(
      process.cwd(), 'Source/Angular/preload.js'
    ),
    sandbox: false,
    nodeIntegration: false, 
    contextIsolation: true,
    webviewTag: false, 
  } 
};
const angular_process: ElectronProcess = new ElectronProcess(angularBrowserOptions);
angular_process.AddEntryPoint(
  'http://localhost:4200', ConfigTypeFlags.Release, SourceTypeFlags.Remote
);
angular_process.AddEntryPoint(
  path.join(__dirname, '../../Binaries/GUI/index.html'), ConfigTypeFlags.Debug, SourceTypeFlags.Local
);


async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (!canceled) {
    return filePaths[0]
  }
}


//App LISTENERS
app.on("ready", async _ => {
  ipcMain.handle('dialog:openFile', (event, ...args) => {
    return handleFileOpen();
  });

  ipcMain.handle('sql:get-demo', async () => {
    return await getDemoTable();
  });

  ipcMain.handle('python:test-script', async () => {
    LaunchPython("Source/Python/main.py", []);
  });

  ipcMain.on('ping-main', async () => {
    console.log("Hello from Renderer Process in Main Process!");
  }) 

  angular_process.Load(CONFIGURATION);
  
});

//macOS exclusive, handles soft re-launches
app.on("activate", async _ => {
  if (!angular_process.hasWindow()) {
    angular_process.Load(CONFIGURATION);
  }
  
});

app.on("window-all-closed", () => {

  //Ensures the electron process always shuts down properly if all windows have been closed
  //Don't do this on macOS as users expect to be able to re-launch the app quickly from the dock after all windows get closed
  if (os.platform() != "darwin") {

    setTimeout(() => {
      app.quit();
    }, 1000);
  }
});