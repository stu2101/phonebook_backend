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
    Person.count({}, (err, count) => {
        response.send(`
            <p>Phonebook has info for ${count} ${count > 1 ? "people" : "person"}<p> 
            ${new Date()}
        `);
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    })
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => {
            next(error)
        })
})

app.post("/api/persons", (request, response, next) => {
    const body = request.body;
    const name = body.name;
    
    Person.findOne({ name: new RegExp('^' + name + '$', "i") }, (err, person) => {
        if (person != null) {
            response.status(409).send({error: "Name already exists in database"});
        }
    });

    if (!body.number || !body.name) {
        return response.status(400).json({
            error: "content missing"
        });
    }

    const newPerson = Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(person => {
            response.json(person);
        })
        .catch(error => {
            next(error);
        })
})

app.put("/api/persons/:id", (request, response, next) => {
    const { name, number } = request.body;


    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: "query" }
    )
        .then(newPerson => {
            response.json(newPerson);
        })
        .catch(error => {
            next(error);
        })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("server running on port", PORT);
})