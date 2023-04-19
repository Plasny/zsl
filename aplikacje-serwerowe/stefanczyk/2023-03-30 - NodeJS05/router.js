const controller = require('./controller.js');
const Task = require('./models/task');

module.exports = async (req, res) => {
    if (req.method == 'GET' && req.url == '/api/tasks') {
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
        res.write(JSON.stringify(controller.getAllTasks()));
        res.end();
        return;
    }

    if (req.method == 'GET' && req.url.match(/\/api\/task\/[0-9]+/)) {
        const id = parseInt(req.url.match(/\d+/g)); // update later
        let task = controller.getTask(id);

        if (task == undefined) {
            res.writeHead(404, { 'Content-Type': 'application/json;charset=utf-8' });
            res.write(JSON.stringify({
                status: 404,
                message: `task with id of ${id} not exists`
            }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
            res.write(JSON.stringify(task));
        }

        res.end();
        return;
    }

    if (req.method == 'POST' && req.url == '/api/tasks') {
        const body = await getBody(req)
        const newTask = new Task(body.title, body.description, body.completed)
        controller.addNewTask(newTask)

        res.writeHead(201, { 'Content-Type': 'application/json;charset=utf-8' });
        res.write(JSON.stringify({
            status: 201,
            task: body
        }));
        res.end();
        return;
    }

    if (req.method == 'DELETE' && req.url.match(/\/api\/task\/[0-9]+/)) {
        const id = parseInt(req.url.match(/\d+/g)); // update later
        let exists = controller.checkIfExists(id);

        if (exists) {
            controller.delTask(id)
            res.writeHead(202, { 'Content-Type': 'application/json;charset=utf-8' });
            res.write(JSON.stringify({
                status: 202,
                message: `task with id of ${id} deleted`
            }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json;charset=utf-8' });
            res.write(JSON.stringify({
                status: 404,
                message: `task with id of ${id} not exists`
            }));
        }

        res.end();
        return;
    }

    if (req.method == 'PUT' && req.url.match(/\/api\/task\/[0-9]+/)) {
        const body = await getBody(req)

        const id = parseInt(req.url.match(/\d+/g)); // update later
        const exists = controller.checkIfExists(id);

        if (exists) {
            const task = controller.list.find(task => task.id == id)
            task.setTitle(body.title)
            task.setDescription(body.description)
            task.setCompleted(body.completed)

            res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
            res.write(JSON.stringify({
                status: 200,
                task: controller.list[id]
            }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json;charset=utf-8' });
            res.write(JSON.stringify({
                status: 404,
                message: `task with id of ${id} not exists`
            }));
        }

        res.end();
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json;charset=utf-8' });
    res.write(JSON.stringify("Something went wrong"));
    res.end();
};

async function getBody(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = '';

            req.on('data', (part) => {
                body += part.toString();
            })

            req.on('end', () => {
                resolve(JSON.parse(body))
            })
        } catch (error) {
            reject(error)
        }
    });
}
