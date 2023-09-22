const users = new Map()

export async function addUser(req) {
    const json = await req.json()

    if (!('name' in json && 'pass' in json
        && typeof (json.name) == "string"
        && typeof (json.pass) == "string"
        && json.name != ""
        && json.pass != ""
    )) {
        return new Response("Wrong data", {
            status: 400
        })
    }

    if (users.has(json.name)) {
        return new Response("User already exists", {
            status: 400
        })
    }

    users.set(json.name, {
        username: json.name,
        password: json.pass,
        accountCreation: Date.now()
    })

    console.log("added:", json.name)

    return new Response("User added")
}

export function listUsers() {
    let userList = []

    users.forEach(value => {
        userList.push(value)
    });

    return new Response(JSON.stringify(userList))
}

export function delUser(user) {
    if (!users.has(user))
        return new Response("User does not exist", {
            status: 400
        })

    console.log("deleted:", user)

    users.delete(user)
    return new Response("User deleted")
}
