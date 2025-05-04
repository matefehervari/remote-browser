import { HostInfo } from '../types/host-info';
import { open_browser } from '../utils/actionsHelper';
import { openRemoteBrowserDB } from '../utils/indexedDbHelper';


const getHostInfo = async (): Promise<HostInfo | undefined> => {
    const db = await openRemoteBrowserDB()
    const host_info = await db.transaction('storage').objectStore('storage').get('host_info')
    return host_info
}


let HOST = "127.0.0.1"
let PORT = 1234
console.log("Initial settings loaded: ", JSON.stringify({ host: HOST, port: PORT }))

getHostInfo()?.then((host_info) => {
    HOST = host_info?.host || HOST
    PORT = host_info?.port || PORT
    console.log("Updating settings from DB ", JSON.stringify(host_info))
})

console.log("Loaded initial settings: ", JSON.stringify({ host: HOST, port: PORT }))

chrome.action.onClicked.addListener((tab) => {
    if (tab.id === undefined || tab.url === undefined || tab.url.startsWith('chrome://')) {
        return;
    }

    open_browser(tab.url, HOST, PORT)
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "open-settings",
        title: "Remote Browser Settings",
        contexts: ["action"], // Right-click on the extension icon
    });

    chrome.contextMenus.create({
        id: "send-link",
        title: "Send link to remote browser",
        contexts: ["link"], // Right-click on the extension icon
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "open-settings") {
        chrome.tabs.create({
            url: chrome.runtime.getURL("index.html"),
        });
    }
    else if (info.menuItemId === "send-link" && info.linkUrl) {
        open_browser(info.linkUrl, HOST, PORT)
    }
});

self.addEventListener('message', ({ data }: { data: HostInfo }) => {
    HOST = data.host
    PORT = data.port
    console.log("Updated settings from message: ", JSON.stringify({ host: HOST, port: PORT }))
})
