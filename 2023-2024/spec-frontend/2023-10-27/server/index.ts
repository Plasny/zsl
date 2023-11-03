import { BunFile } from "bun";
import fs from "fs/promises"
import path from "path"

const dataDir = "./data"
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    "Access-Control-Allow-Headers": "Content-Type"
}

async function getFiles(): Promise<Response> {
    let files: string[] = [];

    try {
        files = await fs.readdir(dataDir)
    } catch (err) {
        console.log(err)
        return new Response("Error appeared while getting files", {
            status: 500,
            headers
        })
    }

    return new Response(JSON.stringify(files), {
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
    })
}

async function saveFile(req: Request): Promise<Response> {
    try {
        const formData = await req.formData()
        // console.log(formData)

        if (!formData.has("photo") || !formData.has("photoName"))
            return new Response("Wrong data", {
                status: 400,
                headers
            })

        await fs.writeFile(path.join(dataDir, formData.get("photoName") as string), await (formData.get("photo") as Blob).arrayBuffer())
    } catch (err) {
        console.error(err)
        return new Response("Error appeared while parsing data", {
            status: 500,
            headers
        })
    }

    return new Response("File uploaded", {
        status: 201,
        headers
    })
}

async function getFile(pathname: string): Promise<Response> {
    let files: string[] = [], photo: BunFile;
    const n = parseInt(pathname.match(/\/files\/(\d+)$/)![0].substring(7));

    if (n < 0) {
        return new Response("Wrong file id", {
            status: 400,
            headers
        })
    }

    try {
        files = await fs.readdir(dataDir)

        if (n >= files.length) {
            return new Response("Wrong file id", {
                status: 400,
                headers
            })
        }

        photo = Bun.file(path.join(dataDir, files[n]))
    } catch (err) {
        console.log(err)
        return new Response("Error appeared while getting file", {
            status: 500,
            headers
        })
    }

    return new Response(photo, { headers })
}
async function deleteFile(pathname: string): Promise<Response> {
    let files: string[] = [];
    const n = parseInt(pathname.match(/\/files\/(\d+)$/)![0].substring(7));

    if (n < 0) {
        return new Response("Wrong file id", {
            status: 400,
            headers
        })
    }

    try {
        files = await fs.readdir(dataDir)

        if (n >= files.length) {
            return new Response("Wrong file id", {
                status: 400,
                headers
            })
        }

        await fs.unlink(path.join(dataDir, files[n]))
    } catch (err) {
        console.log(err)
        return new Response("Error appeared while getting file", {
            status: 500,
            headers
        })
    }

    return new Response("File deleted", { headers })
}

async function deleteFiles(req: Request): Promise<Response> {
    const json = await req.json()

    if (json.files == null) {
        return new Response("Files not provided", {
            status: 400,
            headers
        })
    }

    try {
        for (const file of json.files)
            await fs.unlink(path.join(dataDir, file))
    } catch (err) {
        console.log(err)
        return new Response("Error appeared while removing file", {
            status: 500,
            headers
        })
    }

    return new Response("Files removed", { headers })
}

async function renameFile(req: Request, pathname: string): Promise<Response> {
    let files: string[] = [];
    const n = parseInt(pathname.match(/\/files\/(\d+)$/)![0].substring(7));
    const json = await req.json()

    if (n < 0) {
        return new Response("Wrong file id", {
            status: 400,
            headers
        })
    }

    if (json.newName == null) {
        return new Response("New name not provided", {
            status: 400,
            headers
        })
    }

    try {
        files = await fs.readdir(dataDir)

        if (n >= files.length) {
            return new Response("Wrong file id", {
                status: 400,
                headers
            })
        }

        await fs.rename(path.join(dataDir, files[n]), path.join(dataDir, json.newName))
    } catch (err) {
        console.log(err)
        return new Response("Error appeared while getting file", {
            status: 500,
            headers
        })
    }

    return new Response("File renamed", { headers })
}

console.log("start")
Bun.serve({
    fetch(req) {
        const url = new URL(req.url)

        // for CORS to work
        if (req.method === "OPTIONS") return new Response("", { status: 204, headers })

        if (url.pathname === "/") return new Response("Home page!", { headers })

        if (url.pathname === "/files" && req.method === "GET") return getFiles()
        if (url.pathname === "/files" && req.method === "POST") return saveFile(req)
        if (url.pathname === "/files" && req.method === "DELETE") return deleteFiles(req)

        if (url.pathname.match(/\/files\/\d+$/) && req.method === "GET") return getFile(url.pathname)
        if (url.pathname.match(/\/files\/\d+$/) && req.method === "POST") return renameFile(req, url.pathname)
        if (url.pathname.match(/\/files\/\d+$/) && req.method === "DELETE") return deleteFile(url.pathname)

        return new Response("404", { status: 404, headers })
    },
});

