const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    /*** ERROR Warning ***/
    errorStatusUpdate: (callback) => ipcRenderer.on('error-status-update', (event, data) => {callback(data)}),

    /*** Dialog ***/
    showDialog: (args) => ipcRenderer.send('show-dialog', args),

    /*** Setting ***/
    setSetting: (args) => ipcRenderer.invoke('set-setting', args),
    requestSetting: (args) => ipcRenderer.send('request-setting', args),
    getSetting: (callback) => ipcRenderer.on('get-setting', (event, data) => {callback(data)}),
    requestDirPath: (args) => ipcRenderer.send('request-dir-path', args),
    getExportDir: (callback) => ipcRenderer.on('get-export-dir', (event, data) => {callback(data)}),
    getLogoImagePath: (callback) => ipcRenderer.on('get-logoimage-path', (event, data) => {callback(data)}),

    /*** EVENT ***/
    requestAllEvent: (args) => ipcRenderer.send('request-all-event', args),
    getAllEvent: (callback) => ipcRenderer.on('get-all-event', (event, data) => {callback(data)}),
    requestCurrentEvent: (args) => ipcRenderer.send('request-current-event', args),
    getCurrentEvent: (callback) => ipcRenderer.on('get-current-event', (event, data) => {callback(data)}),
    setCurrentEvent: (args) => ipcRenderer.invoke('set-current-event', args),
    createEvent: (args) => ipcRenderer.invoke('create-event', args),
    deleteEvent: (args) => ipcRenderer.invoke('delete-event', args),
});