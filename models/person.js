require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.connect(url)
    .then(result => {
        console.log("Connected to MongoDB");
    })

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8, 
        validate: currentNumber => {
            // if formed of two parts that are separated by -, 
            // the first part has two or three numbers and the second part also consists of numbers
            return /^\d{2,3}-[0-9]+$/.test(currentNumber)
        }
    }
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        
    }
})

module.exports = mongoose.model("Person", personSchema);
