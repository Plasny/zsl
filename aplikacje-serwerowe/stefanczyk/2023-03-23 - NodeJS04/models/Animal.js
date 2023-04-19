class Animal {
    constructor(type = 'dog', color = 'black') {
        this.type = type;
        this.color = color;
    }

    setType(type = this.type) {
        this.type = type;
    }

    setColor(color = this.color) {
        this.color = color;
    }
}

let animalsArray = [];
let lastId = 0;

module.exports = { Animal, animalsArray, lastId };
