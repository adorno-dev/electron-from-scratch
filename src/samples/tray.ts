import { Menu, nativeImage, Tray } from "electron";

export const setTray = () => {

    let tray = new Tray(nativeImage.createFromPath("./dist/assets/electron.png"))

    const contextMenu = Menu.buildFromTemplate([
        {label: "EFS::Home", type: "radio"},
        {label: "EFS::Workarounds", type: "radio"},
        {label: "EFS::Information", type: "radio", checked: true},
        {label: "EFS::Exit", type: "radio"},
    ])

    tray.setToolTip("EFS")
    tray.setContextMenu(contextMenu)
}