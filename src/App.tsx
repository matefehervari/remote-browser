import './App.css'
import { Settings } from './components/Settings/Settings'

function App() {
    const sw = navigator.serviceWorker

    return (
        <>
            <h1>Remote Browser Settings</h1>
            <Settings sw={sw} />
        </>
    )
}

export default App
