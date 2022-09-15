require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.connect(url)
    .then((result) => {
        console.log("Connected to MongoDB");
    });

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
            // formed of two parts separated by "-": first part has two or three numbers and  second part also consists of numbers 
            // ^ means beginning
            // \d{2,3} means a digit, two or three times
            // - means a literal character of a dash(-)
            // [0-9] means the same as digit, and the + after it means that there can be many digits
            // $ means ending
            return /^\d{2,3}-[0-9]+$/.test(currentNumber);
        }
    }
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        
    }
});

module.exports = mongoose.model("Person", personSchema);
