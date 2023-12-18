const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  sqlConnect: (args) => ipcRenderer.invoke('sql:connect', args),
  sqlDisconnect: () => ipcRenderer.invoke('sql:disconnect'),
  sqlQuery: (args) => ipcRenderer.invoke('sql:query', args),
  sqlCreateDatabase: (args) => ipcRenderer.invoke('sql:createDatabase', args),
  sqlDropDatabase: (args) => ipcRenderer.invoke('sql:dropDatabase', args),
})
