
const SequelizeAuto = require('sequelize-auto');
const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electron', {
  generate: (config, callback) => {
    const {database, username, password, ...options} = config;
    const auto = new SequelizeAuto(database, username, password, options);
    auto.run().then(data => {
      callback(data);
    })
  },
  openDialog: () => ipcRenderer.invoke('dialog:open')
});

