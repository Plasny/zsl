const Task = require('./models/task.js');

class TaskList {
    constructor() {
        this.list = [];
        this.lastId = 0;
    }

    /**
     * Method that add new task to the list
     * @param {Task} task 
     */
    addNewTask(task) {
        task.id = ++this.lastId;
        this.list.push(task);
    }

    /**
     * Method that returns whether the list has an item with such id
     * @param {Number} taskId 
     * @returns {Boolean}
     */
    checkIfExists(taskId) {
        for(const el of this.list) {
            if (el.id === taskId) return true;
        }

        return false;
    }

    /**
     * Method that deletes a task with given id
     * @param {Number} taskId 
     */
    delTask(taskId) {
        this.list = this.list.filter(el => el.id != taskId)
    }

    /**
     * Method that returns a task with given id
     * @param {Number} taskId 
     * @returns {Task}
     */
    getTask(taskId) {
        return this.list.find(el => el.id === taskId);
    }

    /**
     * Method that returns all tasks
     * @returns {Object}
     */
    getAllTasks() {
        return this.list;
    }
}

module.exports = new TaskList();
