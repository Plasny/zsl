import { addUser, delUser, listUsers } from "./users"

const server = Bun.serve({
    port: 8080,
    host: "0.0.0.0",
    async fetch(req) {
        // console.log("request", new Date())

        const url = URL(req.url)

        if (url.pathname == "/users" && req.method == "POST") {
            return addUser(req)
        }

        if (url.pathname == "/users" && req.method == "GET") {
            return listUsers()
        }

        const userDelRx = /^\/users\//
        if (userDelRx.test(url.pathname) && req.method == "DELETE") {
            let user = decodeURIComponent(url.pathname).replace(userDelRx, "");
            return delUser(user)
        }

        return new Response("404 - endpoint not found", {
            status: 404
        })
    }
})

console.log("Web server running on port", server.port)
