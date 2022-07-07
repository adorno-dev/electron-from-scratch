import { IpcRenderer } from "electron"

const info = document.getElementById("info")

// @ts-expect-error
info?.innerText = `This app is running Chrome (v${versions.chrome()}), NodeJS (v${versions.node()}) and Electron (v${versions.electron()})`

const ping = async () => {
    // @ts-expect-error
    const response = await window.versions.ping()
    console.log(response)
}

ping()

// 

const API: {
    setTitle: (title: string) => void,
    openFile: () => Promise<string>,
    onUpdateCounter: (callback: any) => IpcRenderer
    // @ts-expect-error
} = api

const setButton = document.getElementById("button") as HTMLButtonElement
const setInput = document.getElementById("title")as HTMLInputElement

setButton.addEventListener("click", () => {
    const title = setInput.value
    API.setTitle(title)
})

// 

const buttonOpenFile = document.getElementById("buttonOpenFile") as HTMLButtonElement
const labelFilePath = document.getElementById("labelFilePath") as HTMLSpanElement

buttonOpenFile.addEventListener("click", async () => {
    const filePath = await API.openFile()
    labelFilePath.innerText = filePath
})

//

const counter = document.getElementById("counter") as HTMLElement

API.onUpdateCounter((_event: any, value: any) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue

    // _event.sender.send("counter-value", newValue)
})