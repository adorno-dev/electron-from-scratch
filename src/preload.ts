import { contextBridge, ipcRenderer, webContents } from "electron";

contextBridge.exposeInMainWorld("_versions", {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
})

contextBridge.exposeInMainWorld("_commands", {
    ping: () => ipcRenderer.invoke("ping")
})

contextBridge.exposeInMainWorld("_api", {
    setTitle: (title: string) => ipcRenderer.send("set-title", title),
    openFile: () => ipcRenderer.invoke("dialog:openFile"),
    onUpdateCounter: (callback: any) => ipcRenderer.on("update-counter", callback)
})

// window.addEventListener("DOMContentLoaded", () => {
//     const counter = document.querySelector("#counter") as HTMLElement
//     ipcRenderer.on("update-counter", (e, v) => {
//         const pv = Number(counter.innerText)
//         const nv = pv + v
//         counter.innerText = nv
//     })
// })

contextBridge.exposeInMainWorld("_ipcRenderer", {
    postMessage: (channel: string, message: any, transfer: MessagePort[]) => {
        // There's a problem to import ipcRenderer on client side, so I tried to implement it
        // indirectly on preload. Otherwise you gonna take an error telling the exports is undefined.
    }
})