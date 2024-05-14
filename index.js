const express = require('express');
const fs = require('fs');
const errors = require('./errors/handleErrors.js');
const app = express();
const funcion = require('./funciones/fun.js')
const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns');

app.use(express.json());

const PORT = process.env.SV_PORT || 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

let status = "";
let message = "";

app.post('/roommate', async (req, res) => {
    try {
        
        const nuevoRoommate = await funcion.obtenerRoommateAleatorio();
        const { roommates } = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
        roommates.push(nuevoRoommate);
        fs.writeFileSync("roommates.json", JSON.stringify({ roommates }));
        res.status(201).json({ message: "Se ha agregado un nuevo roommate", roommate: nuevoRoommate });

    } catch (err) {
        console.log("Error General: ", err)
        const final = errors(err.code, status, message);
        console.log("Codigo de Error: ", final.code);
        console.log("Status de Error: ", final.status);
        console.log("Mensaje de Error: ", final.message);
        console.log("Error Original: ", err.message);
        res.status(final.status).json(final.message);
    }
});

app.get('/roommates', async (req, res) => {
    try {
        const roommates = JSON.parse(fs.readFileSync("roommates.json", "utf8"));

        res.json(roommates);
    } catch (err) {
        console.log("Error General: ", err)
        const final = errors(err.code, status, message);
        console.log("Codigo de Error: ", final.code);
        console.log("Status de Error: ", final.status);
        console.log("Mensaje de Error: ", final.message);
        console.log("Error Original: ", err.message);
        res.status(final.status).json(final.message);
    }
});

app.get('/gastos', async (req, res) => {
    try {

        const gastos = JSON.parse(fs.readFileSync("gastos.json", "utf8"));

        res.json(gastos);
    } catch (err) {
        console.log("Error General: ", err)
        const final = errors(err.code, status, message);
        console.log("Codigo de Error: ", final.code);
        console.log("Status de Error: ", final.status);
        console.log("Mensaje de Error: ", final.message);
        console.log("Error Original: ", err.message);
        res.status(final.status).json(final.message);
    }
});

app.post('/gasto', async (req, res) => {

    try {
        const uuid = uuidv4();
        const id = uuid.slice(0, 6);

        const fechaRegistro = new Date();
        const formattedDate = format(fechaRegistro, 'dd/MM/yyyy');

        const nuevoGasto = req.body;
        nuevoGasto.fecha = formattedDate;
        nuevoGasto.id = id;

        const montoTotal = req.body.monto;
        const roommateComprador = req.body.roommate;
        const descripcion = req.body.descripcion;

        if(!descripcion){
            console.log("Por favor ingresar una descripcion");
            return res.status(400).json({ error: "Por favor ingresar una descripcion"})
        }

        // Leer el archivo de roommates
        const roommatesData = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
        const roommates = roommatesData.roommates;

        //Calcular el monto de cada compañero de cuarto debe pagar
        const totalRoommates = roommates.length - 1;
        const montoPorCompañero = Math.floor(montoTotal / totalRoommates);

        //Actualizar los montos "debe y recibe" para cada compañero de cuarto
        roommates.forEach(roommate => {
            if(roommate.nombre === roommateComprador) {
                roommate.recibe += montoTotal;
            }else {
                roommate.debe += montoPorCompañero;
            }
        })

        fs.writeFileSync("roommates.json", JSON.stringify(roommatesData));

        //archivo gastos
        const { gastos } = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        gastos.push(nuevoGasto);
        fs.writeFileSync("gastos.json", JSON.stringify({ gastos }));
        res.status(201).json({ message: "Se ha agregado un nuevo gasto", gasto: nuevoGasto });

    } catch (err) {
        console.log("Error General: ", err)
        const final = errors(err.code, status, message);
        console.log("Codigo de Error: ", final.code);
        console.log("Status de Error: ", final.status);
        console.log("Mensaje de Error: ", final.message);
        console.log("Error Original: ", err.message);
        res.status(final.status).json(final.message);
    }
});

app.put('/gasto/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedGasto = req.body;

        const descripcion = req.body.descripcion;

        if(!descripcion){
            console.log("Por favor ingresar una descripcion");
            return res.status(400).json({ error: "Por favor ingresar una descripcion"})
        }
        
        let { gastos } = JSON.parse(fs.readFileSync("gastos.json", "utf8"));

        const index = gastos.findIndex(gasto => gasto.id === id);
        if (index === -1) {
            return res.status(404).json({ message: "El gasto no existe" });
        }

        // Obtener el gasto antes de la actualización
        const oldGasto = gastos[index];
        const oldMonto = oldGasto.monto;
        const oldRoommate = oldGasto.roommate;
        updatedGasto.id = id;

        // Calcular la diferencia en el monto
        const diffMonto = updatedGasto.monto - oldMonto;

        // Actualizar el gasto
        gastos[index] = updatedGasto;
        fs.writeFileSync("gastos.json", JSON.stringify({ gastos }));

        // Leer el archivo de roommates
        const roommatesData = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
        const roommates = roommatesData.roommates;

        // Actualizar los montos "debe y recibe" para cada compañero de cuarto
        roommates.forEach(roommate => {
            if (roommate.nombre === oldRoommate) {
                roommate.recibe += diffMonto;
            } else {
                const totalRoommates = roommates.length - 1;
                const montoPorCompañero = Math.floor(diffMonto / totalRoommates);
                roommate.debe += montoPorCompañero;
            }
        });

        fs.writeFileSync("roommates.json", JSON.stringify(roommatesData));

        res.json({ message: "Gasto actualizado correctamente" });
    } catch (err) {
        console.log("Error General: ", err)
        const final = errors(err.code, status, message);
        console.log("Codigo de Error: ", final.code);
        console.log("Status de Error: ", final.status);
        console.log("Mensaje de Error: ", final.message);
        console.log("Error Original: ", err.message);
        res.status(final.status).json(final.message);
    }
});

app.delete('/gasto/:id', async (req, res) => {
    try {

        const id = req.params.id;

        let { gastos } = JSON.parse(fs.readFileSync("gastos.json", "utf8"));

        const deletedGasto = gastos.find(gasto => gasto.id === id);
        const montoTotal = deletedGasto.monto;
        const roommateComprador = deletedGasto.roommate;

        // Actualizar los montos "debe y recibe" para cada compañero de cuarto
        const roommatesData = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
        const roommates = roommatesData.roommates;
        const totalRoommates = roommates.length - 1;
        const montoPorCompañero = Math.floor(montoTotal / totalRoommates);

        roommates.forEach(roommate => {
            if (roommate.nombre === roommateComprador) {
                roommate.recibe -= montoTotal;
            } else {
                roommate.debe -= montoPorCompañero;
            }
        });

        fs.writeFileSync("roommates.json", JSON.stringify(roommatesData));
        
        gastos = gastos.filter(gasto => gasto.id !== id);
        fs.writeFileSync("gastos.json", JSON.stringify({ gastos }));
        res.json({ message: "Gasto eliminado correctamente"});

    } catch (err) {
        console.log("Error General: ", err)
        const final = errors(err.code, status, message);
        console.log("Codigo de Error: ", final.code);
        console.log("Status de Error: ", final.status);
        console.log("Mensaje de Error: ", final.message);
        console.log("Error Original: ", err.message);
        res.status(final.status).json(final.message);
    }
});

app.use((req, res) => {
    res.send('Esta página no existe...');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});