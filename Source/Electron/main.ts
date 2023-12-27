import { app, shell, session, ipcMain, BrowserWindow, globalShortcut, Menu, MenuItem } from "electron";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import { ElectronProcess } from "./setup";

// const addon = require("../../build/Release/test_binding");




const angularBrowserOptions = { 
  icon: path.join(__dirname, '../src/assets/icon/png/64x64.png'), 
  title: 'Positron Template Project', 
  opacity: 1.00, 
  backgroundColor: '#000000', 
  minWidth: 880, 
  minHeight: 680, 
  width: 961, 
  height: 888,
  show: false, 
  webPreferences: { 
  sandbox: false, 
  nodeIntegration: false, 
  contextIsolation: true, 
  webviewTag: false, 
  } 
};
const angular_process: ElectronProcess = new ElectronProcess(angularBrowserOptions);



//App LISTENERS
app.on("ready", () => {
  angular_process.Load(true);
});

//macOS exclusive, handles soft re-launches
app.on("activate", () => {
  if (!angular_process.hasWindow()) {
    angular_process.Load(true);
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


// IPC Main LISTENERS
ipcMain.on('message-from-renderer', (event, arg) => {
  // Handle the message from the renderer process
  // You can send a response back to the renderer process if needed
  event.sender.send('message-to-renderer', 'This is a response from main process');
});