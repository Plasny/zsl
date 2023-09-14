module.exports = class Task {
    constructor(title, description = '', completed = false) {
        this.title = title;
        this.description = description;
        this.completed = completed;
    }

    setTitle(title = this.title) {
        this.title = title;
    }

    setDescription(desc = this.description) {
        this.description = desc;
    }

    setCompleted(state = this.state) {
        this.completed = state;
    }
}
