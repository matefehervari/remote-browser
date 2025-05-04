import { useEffect, useState } from "react"
import { Label } from "../Label/Label"
import css from "./Settings.module.css"
import { HostInfo } from "../../types/host-info";
import { setDBHostInfo } from "../../utils/indexedDbHelper";
import { open_browser } from "../../utils/actionsHelper";


const defaultHostInfo: HostInfo = {
    host: "127.0.0.1",
    port: 1234
}

interface SettingsProps {
    sw: ServiceWorkerContainer
}

export const Settings: React.FC<SettingsProps> = ({
    sw
}) => {
    // local state of hostInfo
    const [hostInfo, setHostInfo] = useState<HostInfo>(() => {
        const saved = localStorage.getItem("host_info")
        if (saved === null) {
            return defaultHostInfo
        }

        const initialValue: HostInfo = JSON.parse(saved)
        return initialValue || ""
    })

    useEffect(() => {
        sw.controller?.postMessage(hostInfo)
    }, [hostInfo, sw])

    const [hostInput, setHost] = useState<string>("")
    const [portInput, setPort] = useState<string>("")

    const onSave = () => {
        const port = Number.parseInt(portInput)
        const newInfo = {
            host: hostInput || hostInfo.host,
            port: port || hostInfo.port,
        }
        setHostInfo(newInfo)                                       // update local state
        localStorage.setItem("host_info", JSON.stringify(newInfo)) // update local storage
        setDBHostInfo(newInfo)                                     // update db
        sw.controller?.postMessage(newInfo)                        // send update to service worker
        setHost("")
        setPort("")

        return newInfo
    }

    const onTest = () => {
        const { host, port } = onSave()
        open_browser("www.google.com", host, port)
    }

    return (
        <div className={css.settingsDiv}>
            <Label label='Host'>
                <input
                    type='text'
                    value={hostInput}
                    placeholder={hostInfo.host}
                    onChange={(e) => setHost(e.target.value)}
                    size={10}
                    alt='placeholder'
                />
            </Label>
            <Label label='Port'>
                <input
                    type='text'
                    value={portInput}
                    placeholder={hostInfo.port.toString()}
                    onChange={(e) => setPort(e.target.value)}
                    size={10}
                    alt='placeholder'
                />
            </Label>
            <div className={css.buttonsDiv}>
                <button onClick={onSave}>Save</button>
                <button onClick={onTest}>Test</button>
            </div>
        </div >
    )
}
