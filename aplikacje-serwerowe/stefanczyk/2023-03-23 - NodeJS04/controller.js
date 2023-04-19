const animals = require('./models/Animal.js');

module.exports = {
    add: (type, color) => {
        const animal = new animals.Animal(type, color)
        animals.animalsArray.push({ id: ++animals.lastId, animal: animal })
    },

    del: (id) => {
        animals.animalsArray = animals.animalsArray.filter(animal => animal.id != id)
    },

    update: (id, type, color) => {
        const index = animals.animalsArray.findIndex(el => el.id == id)
        animals.animalsArray[index].animal.setType(type);
        animals.animalsArray[index].animal.setColor(color);
    },

    getAll: () => {
        return animals.animalsArray
    }
};
