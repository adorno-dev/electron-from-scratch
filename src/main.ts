import {BrowserWindow, app, ipcMain, IpcMainEvent, dialog} from "electron"
import { Menu } from "electron/main"
import {join} from "path"

// Pattern #1 (renderer to main - one-way) ~ ipcMain.on / ipcRenderer.send
function handleSetTitle(event: IpcMainEvent, title: string) {
    const webContents = event.sender
    const window = BrowserWindow.fromWebContents(webContents)
    window?.setTitle(title)
}

// Pattern #2 (render to main - two-way) ~ ipcMain.handle / ipcRenderer.invoke
async function handleFileOpen() {
    const {canceled, filePaths} = await dialog.showOpenDialog(BrowserWindow.getAllWindows()[0])
    if (canceled)
        return
    else
        return filePaths[0]
}

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, "preload.js")
        }
    })

    // Menu
    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => window.webContents.send("update-counter", 1),
                    label: "Increment"
                },
                {
                    click: () => window.webContents.send("update-counter", -1),
                    label: "Decrement"
                }
            ]
        }
    ])

    Menu.setApplicationMenu(menu)
    // 

    ipcMain.handle("ping", () => "pong")

    // // Legacy obsolete
    // ipcMain.on("asynchronous-message", (event, arg) => {
    //     console.log(arg)
    //     event.reply("asynchronous-reply", "pong")
    // })
    // // 

    window.loadFile("index.html")

    // Open DevTools
    window.webContents.openDevTools()
}

app.whenReady()
   .then(() => {
        ipcMain.on("set-title", handleSetTitle)
        ipcMain.handle("dialog:openFile", handleFileOpen)

        ipcMain.on("counter-value", (_event, value) => {
            console.log(value)
        })

        createWindow()

        app.on("activate", () => {
            BrowserWindow.getAllWindows().length === 0 && createWindow()
        })

        app.on("window-all-closed", () => {
            process.platform !== "darwin" && app.quit()
        })
   })