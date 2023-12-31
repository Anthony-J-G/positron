const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('api', {
  pingMain: () => ipcRenderer.send('ping-main'),
  openFile: () => ipcRenderer.invoke('dialog:openFile')
})
