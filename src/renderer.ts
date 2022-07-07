type Versions = {
    node: string,
    chrome: string,
    electron: string
}

type Commands = {
    ping: () => Promise<string>
}

type API = {
    setTitle: (title: string) => void,
    openFile: () => Promise<string>,
    onUpdateCounter: (callback: any) => unknown
}

// @ts-expect-error
const versions: Versions = window._versions
// @ts-expect-error
const commands: Commands = window._commands
// @ts-expect-error
const api: API = window._api

const info = document.querySelector("#info") as HTMLElement
info.innerText =  `See the application versions: \n`
info.innerText += `Chrome: [${versions.chrome}] \n`
info.innerText += `NodeJS: [${versions.node}] \n`
info.innerText += `Electron: [${versions.electron}] \n`

const ping = document.querySelector("#ping") as HTMLButtonElement
ping.addEventListener("click", async () => console.log(await commands.ping()))

const title = document.querySelector("#title") as HTMLInputElement
const titleButton = document.querySelector("#set-title") as HTMLButtonElement
titleButton.addEventListener("click", () => api.setTitle(title.value))

const openedFileText = document.querySelector("#opened-file") as HTMLLabelElement
const openFileButton = document.querySelector("#open-file") as HTMLButtonElement
openFileButton.addEventListener("click", async () => openedFileText.innerText = await api.openFile())

const counter = document.querySelector("#counter") as HTMLElement
api.onUpdateCounter((e: Event, v: string) => {
    const pv = Number(counter.innerText)
    const nv = pv + v
    counter.innerText = nv
})