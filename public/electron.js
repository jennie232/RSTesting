const { app, ipcMain, BrowserWindow, dialog, Menu } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const path = require("path");
const isDev = require("electron-is-dev");
const isMac = process.platform === 'darwin';
const edge = require('electron-edge-js');
var mainWindow, settingWindow;
var deviceName = null;
var deviceInterval = null; 
var hvOn = 0, beepOn = 0, faultOn = 0, lampOn = 0;

/*** Database ***/
var Setting;
async function connectDatabase(){
    await require("./database")(isDev, path, app)
        .then((result) => {
            result.sequelize.sync().then(async () => {
                console.log("Synced db.");
                Setting = result.setting;
            });
        }).catch(err => showDialog("error", "Warning", "Database Error", err.toString()));
}
connectDatabase();

/*** C# Functions ***/
const daqFlex = isDev
    ? path.join(app.getAppPath(), './public/lib/DAQFlex.dll') // Loading it from the public folder for dev
    : path.join(app.getAppPath(), '../build/lib/DAQFlex.dll')
const getDeviceName = edge.func({
    source: function() {/*
        using System;
        using DAQ = MeasurementComputing.DAQFlex;
        using System.Threading;
        using System.Threading.Tasks;

        public class Startup{
            public async Task<object> Invoke(object input){
                string[] deviceNames = DAQ.DaqDeviceManager.GetDeviceNames(DAQ.DeviceNameFormat.NameAndSerno);
                if (deviceNames.Length == 1){ return deviceNames[0]; }
                return null;
            }
        }
    */},
    references: [`${daqFlex}`]
});

const getInfoFromDevice = edge.func({
    source: function() {/*
        using System;
        using DAQ = MeasurementComputing.DAQFlex;
        using System.Threading;
        using System.Threading.Tasks;

        public class Startup{
            private DAQ.DaqDevice device;
            private int HV_DIO = 1;
            private int BEEP_DIO = 3;
            private int FAULT_DIO = 4;
            private int LAMP_DIO = 5;

            private int HvOn = -1;
            private int BeepOn = -1;
            private int FaultOn = -1;
            private int LampOn = -1;
            public async Task<object> Invoke(string input){
                try{
                    string message;
                    if(device == null){
                        device = DAQ.DaqDeviceManager.CreateDevice(input);
                        Console.WriteLine("Connected!");
                    }

                    if (device != null){
                        message = "?DIO{0/" + HV_DIO.ToString() + "}:VALUE";
                        HvOn = (int)device.SendMessage(message).ToValue();

                        message = "?DIO{0/" + BEEP_DIO.ToString() + "}:VALUE";
                        BeepOn = (int)device.SendMessage(message).ToValue();

                        message = "?DIO{0/" + FAULT_DIO.ToString() + "}:VALUE";
                        FaultOn = (int)device.SendMessage(message).ToValue();

                        message = "?DIO{0/" + LAMP_DIO.ToString() + "}:VALUE";
                        LampOn = (int)device.SendMessage(message).ToValue();
                    }
                }catch(Exception ex){
                    device = null;
                    return ex.Message;
                }
                return "{ \"HvOn\": " + HvOn + ", \"BeepOn\": " + BeepOn + ", \"FaultOn\": " + FaultOn + ", \"LampOn\": " + LampOn + " }";
            }
        }
    */},
    references: [`${daqFlex}`]
});

/*** Functions ***/
function startReadingDevice(){
    deviceInterval = setInterval(() => {
        if(!deviceName){
            getDeviceName("", (err, result) => {
                if(err) clearIntervalAndShowDialog("Wanring", "Error GetDeviceName", err);
                if(result) deviceName = result;
                else clearIntervalAndShowDialog("Warning", "No Device Found", "Please check if the device is connected.");
            });
        }else{
            getInfoFromDevice(deviceName, (err, result) => {
                if(err) clearIntervalAndShowDialog("Wanring", "Error GetInfoFromDevice", err);
                else{
                    try{
                        console.log(result);
                        const json = JSON.parse(result), hvOn_r = json.HvOn, beepOn_r = json.BeepOn, faultOn_r = json.FaultOn, lampOn_r = json.LampOn;
                        if(hvOn !== hvOn_r || beepOn !== beepOn_r || faultOn !== faultOn_r || lampOn !== lampOn_r){
                            hvOn = hvOn_r; beepOn = beepOn_r; faultOn = faultOn_r; lampOn = lampOn_r;
                            statusErrorUpdate(json);
                        }
                    }catch(err){
                        clearIntervalAndShowDialog("Wanring", result, err.toString());
                    }
                }
            })
        }
    }, 1000);
}

function clearIntervalAndShowDialog(title, message, detail){
    clearInterval(deviceInterval);
    showInfoDialogForDevice(title, message, detail);
}

/*** Logging Option ***/
log.transports.file.resolvePath = () => isDev ? `./logs/dev.log` : path.join(app.getPath("userData"), "./logs/prod.log");
log.log("App Version: "+app.getVersion());

/*** Electron Functions ***/
const nativeMenus = [
    // { role: 'appMenu' }
    ...(isMac ? [{
        label: app.name,
        submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
        ]
    }] : []),
    { // { role: 'fileMenu' }
        label: 'File',
        submenu: [
            { label: "Setting", click(){ openSettingWindow() }},
            isMac ? { role: 'close' } : { role: 'quit' } 
        ]
    },
    { // { role: 'editMenu' }
        label: 'Edit',
        submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'selectAll' },
            { type: 'separator' },
        ] : [
            { type: 'separator' },
            { role: 'selectAll' }
        ])
        ]
    },  
    { // { role: 'viewMenu' }
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        role: 'help',
        submenu: [
        ]
    }
];
const menu = Menu.buildFromTemplate(nativeMenus);
Menu.setApplicationMenu(menu);

/*** Dialog ***/
function showInfoDialogForDevice(title, message, detail){
    const opt = { type: "info", buttons: ['OK'], title: title, message: message, detail: detail };
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), opt).then(() => { startReadingDevice(); });
}

function showDialog(type, title, message, detail){
    const opt = { type: type, buttons: ['OK'], title: title, message: message, detail: detail };
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), opt);
}

// Loading it from the public folder for dev || from the build folder for production
const preloadPath = path.join(app.getAppPath(), isDev ? './public/preload.js' : './build/preload.js')

function createWindow(){
    // create main window
    mainWindow = new BrowserWindow({ 
        width: 1600, 
        height: 900,
        icon: path.join(app.getAppPath(), './build/images/radsource_icon.png'),
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    mainWindow.loadURL(isDev ? "http://localhost:3000": `file://${path.join(__dirname, "../build/index.html")}`);
    startReadingDevice();

    if(!isDev)
        autoUpdater.setFeedURL({ provider: 'github', owner: 'goo951019', repo: 'electron-react-app', private: true, token: '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' })

    mainWindow.on("closed", () => (mainWindow = null));
}

function openSettingWindow(){
    settingWindow = new BrowserWindow({
        width: 800,
        height: 800,
        modal: true,
        parent: mainWindow,
        resizable: false,
        icon: path.join(app.getAppPath(), './build/images/radsource_icon.png'),
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    settingWindow.setMenuBarVisibility(false);
    settingWindow.loadURL(isDev ? "http://localhost:3000#/setting": `file://${path.join(__dirname, "../build/index.html")}#/setting`);
}

function getDirPath(event, setting){
    const config = {
        defaultPath: require('os').homedir(), 
        properties: setting === "logoImage" ? ['openFile'] : ['openDirectory']
    }
    if(setting === "logoImage") config["filters"] = [{ name: 'Images', extensions: ['jpg', 'png'] }];
    dialog.showOpenDialog( BrowserWindow.getFocusedWindow(), config).then(result => {
        console.log("result", result);
        if(result.canceled){ return; }
        if(setting === "export") event.sender.send('get-export-dir', result.filePaths[0]);
        else if(setting === "logoImage") event.sender.send('get-logoimage-path', result.filePaths[0]);
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") { app.quit(); }
});

app.on("activate", () => {
    if (mainWindow === null) { createWindow(); }
});

/*** Auto Updater ***/
autoUpdater.on("checking-for-update", () => { log.info("Checking for an update..."); })

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
    log.info("Update Available!");
    const dialogOptions = {
        type: "info",
        buttons: ['OK'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version is being downloaded.'
    }
    dialog.showMessageBox(dialogOptions, (response) => { })
});

autoUpdater.on("update-not-available", () => { log.info("Update not available.");});
autoUpdater.on("download-progress", (progressTrack) => { log.info("Downloading..."+parseFloat(progressTrack.percent).toFixed(2)+"%"); })

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
    log.info("Update Downloaded.");
    const dialogOptions = {
        type: "info",
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }
    dialog.showMessageBox(dialogOptions).then((returnValue) => {
        if(returnValue.response === 0) autoUpdater.quitAndInstall();
    })
});

autoUpdater.on("error", (err) => {log.info("Update Error: "+ err)})

/*** IPC MAIN FUNCTION - SENDING DATA OVER TO UI ***/
function statusErrorUpdate(result){
    mainWindow.webContents.send("error-status-update", result);
}

// Dialog
ipcMain.on('show-dialog', async (event, args) => { showDialog(args.type, args.title, args.message, args.detail); });

// Setting
function getSetting(event){
    Setting.findAll({order: [['id', 'ASC']]})
        .then(data => { event.sender.send('get-setting', data); })
        .catch(error => { event.sender.send('get-setting', error); }); 
}

ipcMain.handle('set-setting', async (event, args) => { // Set Setting
    args.forEach(async (s) => { await Setting.upsert({ id: s.id, setting_name: s.setting_name, setting_value: s.setting_value }); })
    getSetting(event);
});

ipcMain.on('request-setting', async (event, args) => { // Set Setting
    getSetting(event);
});

ipcMain.on('request-dir-path', async (event, args) => { // Set Setting
    getDirPath(event, args.setting);
});