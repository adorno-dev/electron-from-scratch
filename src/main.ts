import {app, BrowserWindow, dialog, ipcMain, IpcMainEvent, Menu, WebContents} from "electron"
import {join} from "path"

// Pattern #2 (Two-Way) (Render -> Main) (ipcMain.handle/ipcRenderer.invoke)
async function fileOpen() {
    const {canceled, filePaths} = await dialog.showOpenDialog(BrowserWindow.getAllWindows()[0])
    if (canceled)
        return
    else
        return filePaths[0]
}

// Pattern #1 (One-Way) (Render -> Main) (ipcMain.on/ipcRenderer.send)
function setTitle(event: IpcMainEvent, title: string) {
    const webContents = event.sender as WebContents
    const window = BrowserWindow.fromWebContents(webContents) as BrowserWindow
    window.setTitle(title)
}

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        // autoHideMenuBar: true,
        webPreferences: {
            sandbox: true,
            preload: join(__dirname, "preload.js")
        }
    })
    setIpcHandlers()
    setWindowMenu(window)
    window.loadFile("index.html")
    // window.webContents.openDevTools()
}

function setWindowMenu(window: BrowserWindow) {
    const menu = Menu.buildFromTemplate([{
        label: "Counter",
        submenu: [
            { click: () => window.webContents.send("update-counter", 1), label: "Increment" },
            { click: () => window.webContents.send("update-counter", -1), label: "Decrement" },
        ]
    }])
    Menu.setApplicationMenu(menu)
}

function setIpcHandlers() {
    ipcMain.handle("ping", () => "[IPC-Main] [Pong]")
    ipcMain.handle("dialog:openFile", fileOpen)
    ipcMain.on("set-title", setTitle)
}

app.enableSandbox()
app.whenReady()
   .then(() => {
        app.on("activate", () => {
            BrowserWindow.getAllWindows().length === 0 && createWindow()
        })
        app.on("window-all-closed", () => {
            process.platform !== "darwin" && app.quit()
        })
        createWindow()
   })