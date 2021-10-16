import express from 'express'
import faker from 'faker'
import axios from 'axios'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 5000
app.use(cors())

//Devuelve los headers del navegador
app.get('/', (req, res) => {
    res.json(req.headers)
})

//devuelve un json con un string
app.get('/saludo', (req, res) => {
    res.json({
        hola: 'hola',
    })
})

//devuelve un json con nombre, correo y tel random (faker js)
app.get('/random', (req, res) => {
    res.json({
        nombre: faker.name.findName(),
        correo: faker.internet.email(),
        telefono: faker.phone.phoneNumber(),
    })
})

//se asignan variables de forma :var1/:var2... y se descomponen con la función de express, .params

app.get('/random/:nombre/:apellido', (req, res) => {
    const { nombre, apellido } = req.params
    res.json({
        nombres: `${nombre} ${apellido}`,
        correo: faker.internet.email(),
        telefono: faker.phone.phoneNumber(),
    })
})

app.get('/temperatura', async (req, res) => {
    const clima = await axios
        .get('https://www.metaweather.com/api/location/418440/')
        .then((response) => response.data)
        .then((data) => data.consolidated_weather)

    if (req.query.dia) {
        switch (req.query.dia) {
            case 'hoy':
                res.json(clima[0])
                return

            case 'manana':
                res.json(clima[1])
                return

            case 'pasado':
                res.json(clima[2])
                return
        }
    }

    res.json(clima)
})

app.get('/noautorizado', (req, res) => {
    res.status(401).json({
        mensaje: 'NO AUTORIZADO - ERROR 401',
    })
})

//responde en qué puerto se ejecuta
app.listen(port, () => {
    console.log('se está ejecutando en el puerto ', port)
})
