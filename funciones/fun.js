const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

async function obtenerRoommateAleatorio() {
    try {
        const response = await axios.get("https://randomuser.me/api");
        const { data } = response;
        const randomUser = data.results[0];

        const uuid = uuidv4();
        const id = uuid.slice(0, 6);

        const roommate = {
            id: id,
            nombre: randomUser.name.first,
            email: randomUser.email,
            debe: 0,
            recibe: 0,
            total: 0,
        };
        return roommate;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    obtenerRoommateAleatorio
}