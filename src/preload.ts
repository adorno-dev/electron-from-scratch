import {contextBridge, ipcRenderer} from "electron"

contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    
    ping: () => ipcRenderer.invoke("ping")
})

contextBridge.exposeInMainWorld("api", {
    setTitle: (title: string) => ipcRenderer.send("set-title", title),
    openFile: () => ipcRenderer.invoke("dialog:openFile"),

    onUpdateCounter: (callback: any) => ipcRenderer.on("update-counter", callback),
})

// Legacy (obsolete)

// ipcRenderer.on("asynchronous-reply", (_event, arg) => {
//     console.log(arg)
// })

// ipcRenderer.send("asynchronous-message", "ping")

// 

window.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("counter") as HTMLElement
    ipcRenderer.on("update-counter", (_event, value) => {
        const oldValue = Number(counter.innerText)
        const newValue = oldValue + value
        counter.innerText = newValue
    })
})