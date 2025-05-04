import { HostInfo } from '../types/host-info';
import { openDB } from 'idb';

const DB_NAME = 'remote-browser-db'

export async function setData(key: string, value: object) {
    const db = await openRemoteBrowserDB();
    const tx = db.transaction('storage', 'readwrite');
    tx.objectStore('storage').put(value, key);
    await tx.done;
}

export async function setDBHostInfo(host_info: HostInfo) {
    await setData("host_info", host_info)
}

export async function getData(key: string) {
    const db = await openRemoteBrowserDB();
    const tx = db.transaction('storage', 'readonly');
    const result = await tx.objectStore('storage').get(key);
    return result;
}

export async function getDBHostData(): Promise<HostInfo | undefined> {
    return await getData("host_info")
}

export async function openRemoteBrowserDB() {
    return await openDB(DB_NAME, 2, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('storage')) {
                db.createObjectStore('storage');
            }
        },
    });
}
