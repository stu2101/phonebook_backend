require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

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

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });

})

app.get("/info", (request, response) => {
    
    const length = Person.length + 1;

    response.send(`
        <p>Phonebook has info for ${length} ${length > 1 ? "people" : "person"}<p> 
        ${new Date()}
    `);
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    })
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
})

app.post("/api/persons", (request, response) => {
//     if (!request.body.number || !request.body.name) {
//         return response.status(400).json({
//             error: "content missing"
//         });
//     }
// 
//     if (persons.find(person => person.name === request.body.name) !== undefined) {
//         return response.status(400).json({
//             error: "name must be unique"
//         });
//     }
// 
//     const newPerson = { id: Math.round(Math.random() * (10000000 - persons.length) + persons.length), ...request.body }
//     persons = persons.concat(newPerson);
//     console.log(persons);
// 
//     response.json(newPerson);

    const body = request.body;

    if (!body.number || !body.name) {
        return response.status(400).json({
            error: "content missing"
        });
    }

    const newPerson = Person({
        name: body.name,
        number: body.number
    })

    newPerson.save().then(person => {
        response.json(person);
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("server running on port", PORT);
})