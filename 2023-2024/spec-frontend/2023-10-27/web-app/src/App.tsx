import { useEffect, useState } from "react";

function App() {
    let mainEl;

    const [files, setFiles] = useState([] as string[])
    const [screen, setScreen] = useState("");
    const [settings, setSettings] = useState({ serverAddr: "localhost", serverPort: "3000" })
    const [fileEls, setFileEls] = useState([<></>])
    const [selected, setSelected] = useState([] as boolean[]);
    const [deselect, setDeselect] = useState(false)

    const rename = async (id: string | number) => {
        let newName = prompt("Enter a new name for file.")

        if (newName == null) return

        const res = await fetch(`http://${settings.serverAddr}:${settings.serverPort}/files/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ newName })
        })

        if (res.ok) alert("Photo renamed succesfully")
        else alert("There was an error")

        // @ts-ignore
        files[id] = newName;
        setFiles([...files])

        drawFiles()
    }

    const del = async (id: string | number, reload = true) => {
        const res = await fetch(`http://${settings.serverAddr}:${settings.serverPort}/files/${id}`, { method: "DELETE" })

        if (!reload)
            return

        if (res.ok) alert("Photo deleted succesfully")
        else alert("There was an error")

        loadFiles()
    }

    const loadFiles = async () => {
        setFiles((await (await fetch(`http://${settings.serverAddr}:${settings.serverPort}/files`)).json()) as string[])

        for (let i in files)
            selected[i] = false;

        setSelected([...selected])
        drawFiles()
    }

    const drawFiles = () => {
        let arr = [];

        for (let i in files) {
            const file = files[i]
            // current_time is for realoading photos each time `?current_time=${Date.now()}`
            const imgUrl = `http://${settings.serverAddr}:${settings.serverPort}/files/${i}?current_time=${Date.now()}`

            console.log(`selected ${i}: ${selected[i]}`)

            arr.push(
                <div
                    className="w-[32%] h-[39vh] flex flex-col items-center border-black border-2 rounded-md p-2 overflow-hidden justify-center"
                    style={selected[i] ? {
                        backgroundColor: "#86efac",
                        borderColor: "#86efac",
                    } : {}}
                    onClick={() => {
                        selected[i] = !selected[i];
                        setSelected([...selected]);
                        drawFiles();
                    }}
                >
                    <div className="text-xs mb-[1vh]">{file}</div>
                    <a href={imgUrl}><img src={imgUrl} alt="photo on server" className="rounded-md object-cover w-[29vh] h-[29vh]" /></a>
                    <div className="w-full flex items-center mt-[1vh] w-[29vh]">
                        <button
                            type="button"
                            className="p-1 grow mr-2 rounded-md bg-green-100"
                            onClick={() => { del(i) }}
                        >delete</button>
                        <button
                            type="button"
                            className="p-1 grow ml-2 rounded-md bg-green-100"
                            onClick={() => { rename(i) }}
                        >rename</button>
                    </div>
                </div>
            )
        }

        setFileEls(arr);
    }

    const selectAll = () => {
        for (let i in files)
            deselect
                ? selected[i] = false
                : selected[i] = true;

        setDeselect(!deselect)
        setSelected([...selected])
        drawFiles()
    }

    const removeSelected = async () => {
        const toDel = [];
        const toKeep = [];

        for (let i in selected) {
            if (selected[i]) {
                selected[i] = false
                toDel.push(files[i]);
            } else {
                toKeep.push(files[i]);
            }
        }

        const res = await fetch(`http://${settings.serverAddr}:${settings.serverPort}/files`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ files: toDel })
        })

        if (res.ok) alert("Photos deleted succesfully")
        else alert("There was an error")

        setFiles(toKeep)
        await loadFiles()
    }

    useEffect(() => {
        loadFiles()
    }, [settings])

    switch (screen) {
        case "settings":
            mainEl = (
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        setSettings({
                            // @ts-ignore
                            serverAddr: e.target.serverAddr.value,
                            // @ts-ignore
                            serverPort: e.target.serverPort.value
                        })
                        setScreen("")
                    }}
                    className="flex flex-col items-center"
                >
                    <label
                        className="block w-96 my-4"
                    >Server address: <input
                            className="border-b-2 border-black w-full"
                            name="serverAddr"
                            defaultValue={settings.serverAddr}
                        /></label>
                    <label
                        className="block w-96 mb-4"
                    >Server port: <input
                            className="border-b-2 border-black w-full"
                            name="serverPort"
                            defaultValue={settings.serverPort}
                        /></label>
                    <div className="flex px-8 w-96 justify-between">
                        <button
                            type="button"
                            className="p-2 w-2/5 border-2 border-black rounded-md"
                            onClick={() => setScreen("")}
                        >cancel</button>
                        <button
                            className="p-2 w-2/5 border-2 border-black rounded-md"
                            type="submit"
                        >save</button>
                    </div>
                </form>
            )
            break;
        default:
            mainEl = (
                <div className="flex flex-wrap w-full gap-x-[2%] gap-y-10">{fileEls}</div>
            )
    }

    return (
        <div role="main" className="w-sreen h-screen flex flex-col items-center">
            <nav className="w-screen sm:w-4/5 h-[5vh] px-16 flex justify-between border-b-2 border-black mb-8">
                <button
                    onClick={loadFiles}
                >Reload</button>
                <button
                    onClick={selectAll}
                >{deselect ? "Deselect All" : "Select All"}</button>
                <button
                    onClick={removeSelected}
                >Remove Selected</button>
                <button
                    onClick={() => setScreen("settings")}
                >Settings</button>
            </nav>
            <div className="grow w-screen sm:w-4/5">
                {mainEl}
            </div>
        </div>
    )
}

export default App;
