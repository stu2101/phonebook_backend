const express = require("express");
const cors = require("cors");   
const morgan = require("morgan");

const app = express();

app.use(express.static('build'))
app.use(express.json());
app.use(cors());

// comment just to change file
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        Object.keys(req.body).length ? JSON.stringify(req.body) : []
    ].join(' ')
}))


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons);
})

app.get("/info", (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} ${persons.length > 1 ? "people" : "person"}<p> 
        ${new Date()}
    `);
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    }
    else {
        response.status(404).end();
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
})

app.post("/api/persons", (request, response) => {
    if (!request.body.number || !request.body.name) {
        return response.status(400).json({
            error: "content missing"
        });
    }

    if (persons.find(person => person.name === request.body.name) !== undefined) {
        return response.status(400).json({
            error: "name must be unique"
        });
    }

    const newPerson = { id: Math.round(Math.random() * (10000000 - persons.length) + persons.length), ...request.body }
    persons = persons.concat(newPerson);
    console.log(persons);

    response.json(newPerson);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("server running on port", PORT);
})